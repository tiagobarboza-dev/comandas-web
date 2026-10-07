import { getClientes, criarCliente, abrirComanda } from '../services/comandaService.js';
import { empty, modal, act, esc, icon } from '../components/ui.js';
import { pad } from '../utils/format.js';

export async function render(el, { q = '' } = {}) {
  let lista = await getClientes();
  el.innerHTML = `<div class="head"><div><h1>Clientes</h1><p>Cadastre quem chegou e abra a comanda da mesa.</p></div><button class="btn" id="novo">${icon('plus')} Novo cliente</button></div>
    <div class="chips"><input class="input" id="s" style="max-width:320px;margin:0" placeholder="Buscar por nome…" value="${esc(q)}" aria-label="Buscar por nome"></div><div id="list"></div>`;
  const s = el.querySelector('#s');
  const paint = () => {
    const t = s.value.trim().toLowerCase();
    const f = lista.filter(c => c.nome.toLowerCase().includes(t));
    el.querySelector('#list').innerHTML = f.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Nome</th><th>Mesa</th><th>Comanda</th><th>Status</th><th></th></tr></thead><tbody>${f.map(c => {
      const cm = c.comanda, aberta = cm?.aberta;
      return `<tr><td><b>${esc(c.nome)}</b></td><td>${c.mesa}</td><td>${cm ? '#' + pad(cm.numero) : '—'}</td>
      <td><span class="badge ${cm ? (aberta ? '' : 'fechada') : 'sem'}">${cm ? (aberta ? 'Aberta' : 'Fechada') : 'Sem comanda'}</span></td>
      <td class="r">${aberta ? `<a class="btn sm ghost" href="#/comandas/${cm.numero}">Ver comanda</a>` : `<button class="btn sm" data-abrir="${c.id}">Abrir comanda</button>`}</td></tr>`;
    }).join('')}</tbody></table></div>`
      : empty('users', lista.length ? 'Cliente não encontrado.' : 'Nenhum cliente cadastrado.', lista.length ? '' : '<button class="btn" data-novo>Cadastrar cliente</button>');
  };
  const novo = () => {
    const m = modal(`<h3>Novo cliente</h3><label>Nome</label><input class="input" id="n" autofocus><label>Número da mesa</label><input class="input" id="m" type="number" min="1">
      <div class="actions"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="ok">Cadastrar</button></div>`);
    m.el.querySelector('#ok').onclick = async () => {
      const r = await act(() => criarCliente({ nome: m.el.querySelector('#n').value, mesa: Number(m.el.querySelector('#m').value) }), 'Cliente cadastrado com sucesso.');
      if (r) { m.close(); lista = await getClientes(); paint(); }
    };
  };
  el.onclick = async e => {
    if (e.target.closest('#novo,[data-novo]')) novo();
    const b = e.target.closest('[data-abrir]');
    if (b) { const r = await act(() => abrirComanda(Number(b.dataset.abrir)), 'Comanda aberta.'); if (r) location.hash = '#/comandas/' + r.numero; }
  };
  s.oninput = paint;
  paint();
}
