// Troque USE_MOCK para false quando o Spring Boot estiver rodando.
export const USE_MOCK = false;
export const API_URL = 'http://localhost:8080/api';

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
