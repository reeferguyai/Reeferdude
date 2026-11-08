import http from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const file = resolve(".env");
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile();

const PORT = Number(process.env.API_PORT || 3001);
const HOST = process.env.API_HOST || "127.0.0.1";
const MODEL = process.env.OPENAI_MODEL || "gpt-6-luna";
const API_KEY = process.env.OPENAI_API_KEY || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",").map((value) => value.trim()).filter(Boolean);
const MAX_BODY_BYTES = 32 * 1024;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const requestCounts = new Map();

const SYSTEM_INSTRUCTIONS = [
  "You are GanjaGuru, the conversational intelligence for ReeferDude and PotGrowHub.",
  "Use a relaxed, warm, witty, street-smart but clear and professional voice. Be useful, not performative.",
  "Help with cannabis culture education, hemp, lawful products, design, grow-room planning, blueprints, business planning and sustainability.",
  "Do not diagnose medical conditions, prescribe treatments, or make medical efficacy claims. For health concerns, encourage qualified medical advice.",
  "Do not give legal conclusions. Explain that cannabis and hemp rules vary by jurisdiction and recommend checking current official rules.",
  "Never invent products, prices, inventory, supplier approvals, certifications, shipping availability, delivery estimates, reviews or completed actions.",
  "If current verified catalog or supplier data is not provided, say that you cannot verify it and offer a research checklist or quote-request plan.",
  "Do not claim to place orders, send messages, charge payments, publish content or control devices. No external tools are connected in this initial release.",
  "Ask for missing constraints when needed. Label estimates and uncertainty. Prefer concise, actionable answers.",
  "Do not claim to be a human or licensed professional."
].join(" ");

function json(res, status, body, requestId) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Request-Id": requestId
  });
  res.end(JSON.stringify(body));
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;
  if (!ALLOWED_ORIGINS.includes(origin)) return false;
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return true;
}

function isRateLimited(req) {
  const ip = req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = requestCounts.get(ip) || { start: now, count: 0 };
  if (now - record.start >= WINDOW_MS) {
    record.start = now;
    record.count = 0;
  }
  record.count += 1;
  requestCounts.set(ip, record);
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("Request body too large."), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function normalizeMessages(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw Object.assign(new Error("Send at least one chat message."), { status: 400 });
  }
  const messages = value.slice(-14).map((item) => {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
      throw Object.assign(new Error("Each message needs a valid role and text content."), { status: 400 });
    }
    const content = item.content.trim().slice(0, 6000);
    if (!content) throw Object.assign(new Error("Chat messages cannot be empty."), { status: 400 });
    return { role: item.role, content };
  });
  if (messages[messages.length - 1].role !== "user") {
    throw Object.assign(new Error("The last chat message must be from the user."), { status: 400 });
  }
  return messages;
}

function sendEvent(res, payload) {
  res.write("data: " + JSON.stringify(payload) + "\n\n");
}

async function streamOpenAI(messages, res, requestId) {
  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: SYSTEM_INSTRUCTIONS,
      input: messages,
      stream: true,
      max_output_tokens: 900
    }),
    signal: AbortSignal.timeout(90_000)
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    let code = "AI_PROVIDER_ERROR";
    if (upstream.status === 401 || upstream.status === 403) code = "AI_INVALID_KEY";
    else if (upstream.status === 429) code = "AI_RATE_LIMITED";
    else if (upstream.status >= 500) code = "AI_SERVICE_UNAVAILABLE";
    const error = new Error("The AI provider returned HTTP " + upstream.status + ".");
    error.code = code;
    error.status = upstream.status;
    error.detail = detail.slice(0, 1000);
    throw error;
  }

  if (!upstream.body) throw new Error("The AI provider returned no response stream.");

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let outputSeen = false;

  function handleBlock(block) {
    const dataLines = block.split(/\r?\n/).filter((line) => line.startsWith("data:"));
    if (!dataLines.length) return;
    const raw = dataLines.map((line) => line.slice(5).trim()).join("\n");
    if (!raw || raw === "[DONE]") return;
    let packet;
    try { packet = JSON.parse(raw); } catch { return; }
    if (packet.type === "response.output_text.delta" && typeof packet.delta === "string") {
      outputSeen = true;
      sendEvent(res, { delta: packet.delta });
    } else if (packet.type === "error" || packet.type === "response.failed") {
      throw new Error("The AI response could not be completed.");
    }
  }

  while (true) {
    const result = await reader.read();
    if (result.done) break;
    buffer += decoder.decode(result.value, { stream: true });
    buffer = buffer.replace(/\r\n/g, "\n");
    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      handleBlock(block);
    }
  }
  buffer += decoder.decode();
  if (buffer.trim()) handleBlock(buffer);
  if (!outputSeen) throw new Error("The AI provider returned an empty response.");
  sendEvent(res, { done: true, requestId });
}

const server = http.createServer(async (req, res) => {
  const requestId = randomUUID();
  try {
    if (!applyCors(req, res)) return json(res, 403, { error: "Origin is not allowed.", code: "ORIGIN_NOT_ALLOWED" }, requestId);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const url = new URL(req.url || "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, {
        ok: true,
        service: "reeferdude-api",
        aiConfigured: Boolean(API_KEY),
        model: API_KEY ? MODEL : null,
        mode: API_KEY ? "cloud-ai-available" : "local-fallback-only",
        requestId
      }, requestId);
    }

    if (req.method === "GET" && url.pathname === "/api/ready") {
      return json(res, 200, { ready: true, aiConfigured: Boolean(API_KEY), requestId }, requestId);
    }

    if (req.method !== "POST" || url.pathname !== "/api/chat") {
      return json(res, 404, { error: "API route not found.", code: "NOT_FOUND", requestId }, requestId);
    }

    if (isRateLimited(req)) {
      return json(res, 429, { error: "Too many requests. Please wait a moment.", code: "RATE_LIMITED", requestId }, requestId);
    }

    const body = await readJson(req);
    const messages = normalizeMessages(body.messages);
    if (!API_KEY) {
      return json(res, 503, {
        error: "Cloud AI is not configured. The website can continue in local knowledge mode.",
        code: "AI_NOT_CONFIGURED",
        requestId
      }, requestId);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
      "X-Request-Id": requestId
    });
    res.flushHeaders?.();

    try {
      await streamOpenAI(messages, res, requestId);
      res.end();
    } catch (error) {
      sendEvent(res, {
        error: error.message || "The AI request failed.",
        code: error.code || "AI_REQUEST_FAILED",
        requestId
      });
      res.end();
    }
  } catch (error) {
    const status = error.status || 500;
    json(res, status, {
      error: error.message || "Unexpected API error.",
      code: error.code || "API_ERROR",
      requestId
    }, requestId);
  }
});

server.listen(PORT, HOST, () => {
  console.log("[ReeferDude API] http://" + HOST + ":" + PORT);
  console.log("[ReeferDude API] AI mode: " + (API_KEY ? MODEL : "local fallback only"));
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
