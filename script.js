document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
  }
  const statusEl = document.getElementById('status-box');
  if (statusEl) {
    statusEl.innerHTML = `<p>Verified Co-Owners: <strong>Raymond Meadows & Jessica Mullins</strong></p><p><small>System Active: ${new Date().toLocaleDateString()}</small></p>`;
  }
});
