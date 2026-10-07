import { getComandas, liberarMesa } from '../services/comandaService.js';
import { empty } from '../components/ui.js';
import { brl, pad, qtdItens, tempo } from '../utils/format.js';
import { TOTAL_MESAS } from '../models/index.js';

export async function render(el) {
  const cs = await getComandas();
  const ab = cs.filter(c => c.aberta);
  const totalAb = ab.reduce((s, c) => s + c.total, 0);
  const atendidos = new Set(cs.map(c => c.cliente.id)).size;
   const mesas = Array.from({ length: TOTAL_MESAS }, (_, i) => {
    const ult = cs.filter(c => c.mesa === i + 1 && c.status !== 'LIBERADA')[0];
    const st = !ult ? 'livre' : ult.aberta ? 'aberta' : 'encerrada';
    const label = { livre: 'Livre', aberta: 'Aberta', encerrada: 'Encerrada' }[st];
    const btn = st === 'encerrada'
      ? `<button class="btn sm ghost liberar" data-id="${ult.id}">Liberar</button>`
      : '';
    return `<div class="mesa ${st}">
      Mesa ${i + 1}
      <small><i class="dot ${st}"></i> ${label}</small>
      ${btn}
    </div>`;
  }).join('');
  el.innerHTML = `<div class="head"><div><h1>Salão hoje</h1><p>Visão geral do atendimento.</p></div><a class="btn" href="#/clientes">Atender cliente</a></div>
  <div class="grid stats">
    <div class="card stat hero"><span>Aberto em comandas</span><b class="num">${brl(totalAb)}</b></div>
    <div class="card stat"><span>Comandas abertas</span><b class="num">${ab.length}</b></div>
    <div class="card stat"><span>Comandas fechadas</span><b class="num">${cs.length - ab.length}</b></div>
    <div class="card stat"><span>Clientes atendidos</span><b class="num">${atendidos}</b></div>
  </div>
  <h2>Mesas</h2>
  <div class="legend"><span><i class="dot"></i>Livre</span><span><i class="dot aberta"></i>Comanda aberta</span><span><i class="dot encerrada"></i>Atendimento encerrado</span></div>
  <div class="grid mesas">${mesas}</div>
  <h2>Comandas abertas</h2>
  ${ab.length ? `<div class="grid cards">${ab.map(c => `<div class="card cc"><div class="row"><b>Comanda #${pad(c.numero)}</b><span class="mut">${tempo(c.abertaEm)}</span></div>
    <span>${c.cliente.nome}</span><span class="mut">Mesa ${c.mesa} · ${qtdItens(c)} itens</span>
    <div class="row" style="align-items:center;margin-top:8px"><span class="tot">${brl(c.total)}</span><a class="btn sm ghost" href="#/comandas/${c.numero}">Ver comanda</a></div></div>`).join('')}</div>`
            : empty('receipt', 'Nenhuma comanda aberta no momento.', '<a class="btn" href="#/clientes">Abrir uma comanda</a>')}`;

  // Botões "Liberar" das mesas encerradas
  el.querySelectorAll('.liberar').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Liberar esta mesa?')) return;
      try {
        await liberarMesa(btn.dataset.id);
        render(el); // recarrega o dashboard
      } catch (e) {
        alert('Erro: ' + e.message);
      }
    });
  });
}