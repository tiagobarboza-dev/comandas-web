import { http } from '../api/http.js';

export function getResumo() {
  return http('/relatorios/resumo');
}