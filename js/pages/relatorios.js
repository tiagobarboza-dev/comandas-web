import { getResumo } from '../services/relatorioService.js';
import { brl } from '../utils/format.js';
import { empty } from '../components/ui.js';

export async function render(el) {
  const r = await getResumo();

  if (!r.porDia || r.porDia.length === 0) {
    el.innerHTML = `<div class="head"><div><h1>Relatórios</h1><p>Análise de faturamento.</p></div></div>`
      + empty('chart', 'Nenhum dado de faturamento ainda.');
    return;
  }

  const maxTotal = Math.max(...r.porDia.map(d => Number(d.total)), 1);

  const barras = r.porDia.map(d => {
    const altura = Math.max((Number(d.total) / maxTotal) * 100, 4);
    return `
      <div class="rel-bar-wrap">
        <div class="rel-bar" style="height:${altura}%" title="${brl(Number(d.total))}"></div>
        <span class="rel-bar-dia">${d.diaSemana}</span>
        <span class="rel-bar-data">${d.data}</span>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="head">
      <div><h1>Relatórios</h1><p>Análise de faturamento dos últimos 7 dias.</p></div>
    </div>

    <div class="grid stats">
      <div class="card stat hero">
        <span>Arrecadado hoje</span>
        <b class="num">${brl(Number(r.totalHoje))}</b>
      </div>
      <div class="card stat">
        <span>Últimos 7 dias</span>
        <b class="num">${brl(Number(r.totalSemana))}</b>
      </div>
      <div class="card stat">
        <span>Ticket médio (hoje)</span>
        <b class="num">${brl(Number(r.ticketMedio))}</b>
      </div>
      <div class="card stat">
        <span>Comandas fechadas hoje</span>
        <b class="num">${r.comandasFechadasHoje}</b>
      </div>
    </div>

    <h2>Entradas por dia</h2>
    <div class="card">
      <div class="rel-chart">${barras}</div>
    </div>

    <h2>Detalhamento</h2>
    <table class="tbl">
      <thead><tr><th>Dia</th><th>Data</th><th class="r">Total</th></tr></thead>
      <tbody>
        ${[...r.porDia].reverse().map(d => `
          <tr>
            <td>${d.diaSemana}</td>
            <td>${d.data}</td>
            <td class="r tot">${brl(Number(d.total))}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
}