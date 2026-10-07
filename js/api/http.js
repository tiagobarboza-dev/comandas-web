// Detecta automaticamente o ambiente:
// - Local (localhost/127.0.0.1) → backend local
// - Online (Vercel)             → backend no Railway
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://brasa-sal-api-production.up.railway.app/api';

export async function http(path, { method = 'GET', body } = {}) {
  const res = await fetch(API_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || 'Erro ao comunicar com o servidor.');
  }
  return res.status === 204 ? null : res.json();
}