import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./gravity-gone-nebula.css";
export type NebulaModule={id:string;title:string;subtitle:string;href:string;icon:string};
type Props={modules?:NebulaModule[];onSelect?:(module:NebulaModule)=>void};
const defaults:NebulaModule[]=[
{id:"grow",title:"Grow Room Designer",subtitle:"Shape a room in 3D",href:"/socket/#tools",icon:"🪴"},
{id:"strain",title:"Strain Weaver",subtitle:"Hypothetical trait concepts",href:"/socket/#tools",icon:"🧬"},
{id:"bud",title:"Kali Kush",subtitle:"Learning budtender",href:"/socket/#tools",icon:"💬"},
{id:"journal",title:"Seed-to-Smoke",subtitle:"Keep garden notes",href:"/socket/#tools",icon:"📓"},
{id:"lexicon",title:"Cannabis Cosmos",subtitle:"Slang & knowledge atlas",href:"/socket/#tools",icon:"📚"}];
export function GravityGoneNebula({modules=defaults,onSelect}:Props){
const reduced=useReducedMotion();const particles=useMemo(()=>Array.from({length:7},(_,i)=>i),[]);
return <section className="gg-nebula" aria-label="Gravity Gone navigation">
<div className="gg-avatar" aria-label="Animated avatar exhaling smoke">🌱</div>
<svg className="gg-smoke" viewBox="0 0 720 210" role="img" aria-label="Smoke trails flowing toward the floating menu">
<defs><linearGradient id="ggSmoke" x1="0" x2="1"><stop stopColor="#a6ffae" stopOpacity=".05"/><stop offset=".55" stopColor="#a6ffae" stopOpacity=".65"/><stop offset="1" stopColor="#c69bff" stopOpacity=".15"/></linearGradient></defs>
{particles.map(p=><motion.path key={p} d={"M 0 100 C 150 "+(25+p*18)+", 250 "+(180-p*12)+", 390 "+(75+p*9)+" S 560 "+(35+p*12)+", 710 "+(55+p*14)} fill="none" stroke="url(#ggSmoke)" strokeWidth={2+(p%3)} strokeLinecap="round" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:[0,.8,.2]}} transition={{duration:reduced?0:5+p*.35,repeat:reduced?0:Infinity,delay:p*.25,ease:"easeInOut"}}/>)}
</svg><div className="gg-islands">{modules.map((item,i)=><motion.a key={item.id} href={item.href} className="gg-island" onClick={event=>{if(onSelect){event.preventDefault();onSelect(item)}}} initial={{opacity:0,y:24,scale:.92}} animate={{opacity:1,y:0,scale:1}} transition={{delay:i*.09,duration:.6}} whileHover={reduced?undefined:{scale:1.06,rotate:i%2?2:-2,y:-8}}><span>{item.icon}</span><b>{item.title}</b><small>{item.subtitle}</small></motion.a>)}</div></section>}
