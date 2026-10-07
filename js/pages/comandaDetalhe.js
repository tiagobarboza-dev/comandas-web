import { getComanda, adicionarProduto, removerProduto, fecharComanda } from '../services/comandaService.js';
import { openAddProduct } from '../components/addProductModal.js';
import { act, confirmModal, empty, esc, icon } from '../components/ui.js';
import { brl, pad, hora } from '../utils/format.js';
import { refreshBadge } from '../main.js';

export async function render(el, { id }) {
  let c = await getComanda(id);
  const paint = () => {
    const ed = c.aberta;
    el.innerHTML = `<div class="head"><div><a class="mut" href="#/comandas">← Comandas</a><h1>COMANDA #${pad(c.numero)}</h1>
      <p>Cliente: <b>${esc(c.cliente.nome)}</b> · Mesa: <b>${String(c.mesa).padStart(2, '0')}</b> · Aberta às ${hora(c.abertaEm)} · <span class="badge ${ed ? '' : 'fechada'}">${ed ? 'ABERTA' : 'FECHADA'}</span></p></div>
      ${ed ? `<button class="btn" id="add">${icon('plus')} Adicionar produto</button>` : ''}</div>
      ${ed ? '' : `<div class="lock">${icon('lock')} Comanda fechada: os itens não podem mais ser modificados.</div>`}
      ${c.itens.length ? `<div class="tw"><table class="tbl"><thead><tr><th>Produto</th><th>Quantidade</th><th>Preço unitário</th><th>Subtotal</th><th></th></tr></thead><tbody>${c.itens.map(i => `<tr>
        <td><b>${esc(i.produto.nome)}</b></td>
        <td>${ed ? `<div class="qty"><button data-m="${i.produto.id}" aria-label="Diminuir">−</button><b>${i.quantidade}</b><button data-p="${i.produto.id}" aria-label="Aumentar">+</button></div>` : i.quantidade}</td>
        <td>${brl(i.produto.preco)}</td><td>${brl(i.subtotal)}</td>
        <td class="r">${ed ? `<button class="btn sm ghost dng" data-r="${i.produto.id}" data-q="${i.quantidade}" aria-label="Remover item">${icon('trash', 16)}</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
        : empty('inbox', 'Nenhum item na comanda.', ed ? '<button class="btn" data-add>Adicionar produto</button>' : '')}
      <div class="sum"><div><span>Subtotal</span><span>${brl(c.total)}</span></div><div class="t"><span>Total</span><span class="tot">${brl(c.total)}</span></div></div>
      ${ed ? '<div class="bar"><button class="btn ghost" id="fechar">Fechar comanda</button></div>' : ''}`;
  };
  const upd = r => { if (r) { c = r; paint(); } };
  el.onclick = async e => {
    const t = e.target.closest('button'); if (!t) return;
    const n = c.numero;
    if (t.id === 'add' || 'add' in t.dataset) openAddProduct({ comandaNumero: n, onDone: upd });
    if (t.dataset.p) upd(await act(() => adicionarProduto(n, Number(t.dataset.p), 1), 'Produto adicionado.'));
    if (t.dataset.m) upd(await act(() => removerProduto(n, Number(t.dataset.m), 1), 'Produto removido.'));
    if (t.dataset.r) upd(await act(() => removerProduto(n, Number(t.dataset.r), Number(t.dataset.q)), 'Produto removido.'));
    if (t.id === 'fechar') {
      const ok = await confirmModal({ title: 'Tem certeza que deseja fechar esta comanda?', ok: 'Fechar comanda',
        body: `<p class="mut" style="margin-bottom:10px">COMANDA #${pad(n)} · ${esc(c.cliente.nome)} · Mesa ${c.mesa}</p>
        ${c.itens.map(i => `<div class="line"><span>${i.quantidade}x ${esc(i.produto.nome)}</span><span>${brl(i.subtotal)}</span></div>`).join('') || '<p class="mut">Nenhum item consumido.</p>'}
        <div class="line"><b>Total</b><b class="tot">${brl(c.total)}</b></div>` });
      if (ok) { upd(await act(() => fecharComanda(n), 'Comanda fechada.')); refreshBadge(); }
    }
  };
  paint();
}
