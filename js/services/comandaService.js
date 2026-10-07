// Única camada que as telas conhecem. Mock ou HTTP: a UI não muda.
import { USE_MOCK, http } from '../api/http.js';
import * as mock from '../api/mock.js';

export const getClientes   = () => USE_MOCK ? mock.getClientes() : http('/clientes');
export const criarCliente  = d => USE_MOCK ? mock.criarCliente(d) : http('/clientes', { method: 'POST', body: d });
export const abrirComanda  = id => USE_MOCK ? mock.abrirComanda(id) : http(`/clientes/${id}/comandas`, { method: 'POST' });
export const getComandas   = () => USE_MOCK ? mock.getComandas() : http('/comandas');
export const getComanda    = n => USE_MOCK ? mock.getComanda(n) : http(`/comandas/${n}`);
export const adicionarProduto = (n, produtoId, quantidade) => USE_MOCK ? mock.adicionarProduto(n, produtoId, quantidade) : http(`/comandas/${n}/itens`, { method: 'POST', body: { produtoId, quantidade } });
export const removerProduto   = (n, produtoId, quantidade) => USE_MOCK ? mock.removerProduto(n, produtoId, quantidade) : http(`/comandas/${n}/itens/${produtoId}?quantidade=${quantidade}`, { method: 'DELETE' });
export const fecharComanda = n => USE_MOCK ? mock.fecharComanda(n) : http(`/comandas/${n}/fechar`, { method: 'PATCH' });
export const getProdutos   = () => USE_MOCK ? mock.getProdutos() : http('/produtos');
export async function liberarMesa(id) {
  return http(`/comandas/${id}/liberar-mesa`, { method: 'PATCH' });
}