// Back-end simulado em memória. Replica as regras de Comanda.java / Main.java.
import { CATEGORIA_POR_PRODUTO } from '../models/index.js';

const wait = v => new Promise(r => setTimeout(() => r(structuredClone(v)), 180));
const fail = m => new Promise((_, r) => setTimeout(() => r(new Error(m)), 120));
const ago = m => Date.now() - m * 60000;

const produtos = [['Água', 4], ['Refrigerante', 6.5], ['Suco Natural', 8], ['Prato Executivo', 25], ['Porção de Batata Frita', 18], ['Sobremesa', 10]]
  .map(([nome, preco], i) => ({ id: i + 1, nome, preco, categoria: CATEGORIA_POR_PRODUTO[nome], disponivel: true }));

let clientes = [
  { id: 1, nome: 'João Silva', mesa: 5, comandaAtivaId: 1 },
  { id: 2, nome: 'Maria Souza', mesa: 2, comandaAtivaId: 2 },
  { id: 3, nome: 'Carlos Lima', mesa: 8, comandaAtivaId: 3 },
  { id: 4, nome: 'Ana Prado', mesa: 11, comandaAtivaId: null },
];
let comandas = [
  { numero: 1, clienteId: 1, aberta: true, abertaEm: ago(42), itens: [{ produtoId: 5, quantidade: 2 }, { produtoId: 2, quantidade: 1 }] },
  { numero: 2, clienteId: 2, aberta: true, abertaEm: ago(15), itens: [{ produtoId: 4, quantidade: 1 }, { produtoId: 3, quantidade: 1 }] },
  { numero: 3, clienteId: 3, aberta: false, abertaEm: ago(95), itens: [{ produtoId: 4, quantidade: 2 }] },
];
let proximoNumero = 4, proximoCliente = 5;

const view = c => {
  const cl = clientes.find(x => x.id === c.clienteId);
  const itens = c.itens.map(i => {
    const p = produtos.find(x => x.id === i.produtoId);
    return { produto: p, quantidade: i.quantidade, subtotal: p.preco * i.quantidade };
  });
  return { numero: c.numero, cliente: { id: cl.id, nome: cl.nome }, mesa: cl.mesa, aberta: c.aberta, abertaEm: c.abertaEm, itens, total: itens.reduce((s, i) => s + i.subtotal, 0) };
};
const buscar = n => comandas.find(c => c.numero === Number(n));
const validarQtd = q => Number.isInteger(q) && q > 0;

export const getProdutos = () => wait(produtos);
export const getComandas = () => wait(comandas.map(view).sort((a, b) => b.numero - a.numero));
export const getClientes = () => wait(clientes.map(c => {
  const cm = comandas.find(x => x.numero === c.comandaAtivaId);
  return { id: c.id, nome: c.nome, mesa: c.mesa, comanda: cm ? { numero: cm.numero, aberta: cm.aberta } : null };
}));
export function getComanda(n) { const c = buscar(n); return c ? wait(view(c)) : fail('Comanda não encontrada.'); }

export function criarCliente({ nome, mesa }) {
  if (!nome?.trim() || !Number.isInteger(mesa) || mesa <= 0) return fail('Informe um nome e um número de mesa válido.');
  const c = { id: proximoCliente++, nome: nome.trim(), mesa, comandaAtivaId: null };
  clientes.push(c);
  return wait(c);
}
export function abrirComanda(clienteId) {
  const cl = clientes.find(c => c.id === clienteId);
  if (!cl) return fail('Cliente não encontrado.');
  if (buscar(cl.comandaAtivaId)?.aberta) return fail('Este cliente já possui uma comanda aberta.');
  const c = { numero: proximoNumero++, clienteId, aberta: true, abertaEm: Date.now(), itens: [] };
  comandas.push(c); cl.comandaAtivaId = c.numero;
  return wait(view(c));
}
export function adicionarProduto(n, produtoId, quantidade) {
  const c = buscar(n);
  if (!c) return fail('Comanda não encontrada.');
  if (!c.aberta) return fail('Esta comanda está fechada.');
  if (!validarQtd(quantidade)) return fail('Quantidade inválida.');
  const it = c.itens.find(i => i.produtoId === produtoId);   // sem duplicar item
  it ? (it.quantidade += quantidade) : c.itens.push({ produtoId, quantidade });
  return wait(view(c));
}
export function removerProduto(n, produtoId, quantidade) {
  const c = buscar(n);
  if (!c) return fail('Comanda não encontrada.');
  if (!c.aberta) return fail('Esta comanda está fechada.');
  if (!validarQtd(quantidade)) return fail('Quantidade inválida.');
  const it = c.itens.find(i => i.produtoId === produtoId);
  if (!it) return fail('Produto não encontrado na comanda.');
  if (it.quantidade <= quantidade) c.itens = c.itens.filter(i => i !== it);  // zerou: remove item
  else it.quantidade -= quantidade;
  return wait(view(c));
}
export function fecharComanda(n) {
  const c = buscar(n);
  if (!c) return fail('Comanda não encontrada.');
  if (!c.aberta) return fail('Esta comanda está fechada.');
  c.aberta = false;
  return wait(view(c));
}
