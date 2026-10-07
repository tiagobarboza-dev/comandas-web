export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const P = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9',
  receipt: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6',
  book: 'M4 4h16v16H4zM8 4v16M12 9h4', chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 12h2M3 12h2M12 3v2M12 19v2',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M21 21l-4-4', menu: 'M4 6h16M4 12h16M4 18h16',
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4', inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h6l1 2h4l1-2h6',
};
export const icon = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;

export const loading = el => (el.innerHTML = '<div class="spin" role="status" aria-label="Carregando"></div>');
export const empty = (ic, text, action = '') => `<div class="empty">${icon(ic)}<p>${text}</p>${action}</div>`;

export function toast(msg, type = 'ok') {
  const t = document.createElement('div');
  t.className = 'toast ' + (type === 'err' ? 'err' : '');
  t.textContent = msg;
  document.getElementById('toasts').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 250); }, 3200);
}
// Executa uma ação da API; erro vira toast e retorna undefined.
export async function act(fn, okMsg) {
  try { const r = await fn(); if (okMsg) toast(okMsg); return r; }
  catch (e) { toast(e.message, 'err'); }
}
export function modal(html) {
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  const close = () => { o.classList.add('out'); setTimeout(() => o.remove(), 150); };
  o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-close]')) close(); });
  document.body.append(o);
  return { el: o.firstChild, close };
}
export const confirmModal = ({ title, body, ok = 'Confirmar' }) => new Promise(res => {
  const m = modal(`<h3>${title}</h3>${body}<div class="actions"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="ok">${ok}</button></div>`);
  m.el.querySelector('#ok').onclick = () => { m.close(); res(true); };
  m.el.parentNode.addEventListener('click', e => { if (e.target === m.el.parentNode || e.target.closest('[data-close]')) res(false); });
});
