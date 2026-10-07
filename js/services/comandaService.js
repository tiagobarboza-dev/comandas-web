import { http } from '../api/http.js';

export const getClientes   = () => http('/clientes');
export const criarCliente  = d => http('/clientes', { method: 'POST', body: d });
export const abrirComanda  = id => http(`/clientes/${id}/comandas`, { method: 'POST' });
export const getComandas   = () => http('/comandas');
export const getComanda    = n => http(`/comandas/${n}`);
export const adicionarProduto = (n, produtoId, quantidade) => http(`/comandas/${n}/itens`, { method: 'POST', body: { produtoId, quantidade } });
export const removerProduto   = (n, produtoId, quantidade) => http(`/comandas/${n}/itens/${produtoId}?quantidade=${quantidade}`, { method: 'DELETE' });
export const fecharComanda = n => http(`/comandas/${n}/fechar`, { method: 'PATCH' });
export const getProdutos   = () => http('/produtos');
export async function liberarMesa(id) {
  return http(`/comandas/${id}/liberar-mesa`, { method: 'PATCH' });
}