import { getComandas } from '../services/comandaService.js';
import { empty } from '../components/ui.js';
import { brl, pad, qtdItens, hora } from '../utils/format.js';

const FILTROS = [['todas', 'Todas'], ['abertas', 'Abertas'], ['fechadas', 'Fechadas']];

export async function render(el, { f = 'todas' } = {}) {
  const cs = await getComandas();
  const lista = cs.filter(c => f === 'todas' || (f === 'abertas') === c.aberta);
  el.innerHTML = `<div class="head"><div><h1>Comandas</h1><p>Todas as comandas do dia.</p></div></div>
    <div class="chips">${FILTROS.map(([k, l]) => `<a class="chip ${k === f ? 'on' : ''}" href="#/comandas?f=${k}">${l}</a>`).join('')}</div>
    ${lista.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Nº</th><th>Cliente</th><th>Mesa</th><th>Status</th><th>Itens</th><th>Total</th><th>Abertura</th><th></th></tr></thead><tbody>${lista.map(c => `<tr>
      <td><b>#${pad(c.numero)}</b></td><td>${c.cliente.nome}</td><td>${c.mesa}</td><td><span class="badge ${c.aberta ? '' : 'fechada'}">${c.aberta ? 'Aberta' : 'Fechada'}</span></td>
      <td>${qtdItens(c)}</td><td>${brl(c.total)}</td><td>${hora(c.abertaEm)}</td><td class="r"><a class="btn sm ghost" href="#/comandas/${c.numero}">Ver comanda</a></td></tr>`).join('')}</tbody></table></div>`
      : empty('receipt', 'Nenhuma comanda encontrada.', '<a class="btn" href="#/clientes">Abrir comanda</a>')}`;
}
