// Usado no Cardápio (produto fixo) e no detalhe da comanda (comanda fixa).
import { getProdutos, getComandas, adicionarProduto } from '../services/comandaService.js';
import { modal, act, esc } from './ui.js';
import { brl, pad } from '../utils/format.js';

export async function openAddProduct({ produto, comandaNumero, onDone }) {
  const [prods, cmds] = await Promise.all([getProdutos(), getComandas()]);
  const abertas = cmds.filter(c => c.aberta);
  const disp = prods.filter(p => p.disponivel);
  const m = modal(`<h3>Adicionar produto</h3>
    <label>Produto</label><select class="input" id="p" ${produto ? 'disabled' : ''}>${disp.map(p => `<option value="${p.id}" ${p.id === produto?.id ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}</select>
    <label>Comanda</label><select class="input" id="c" ${comandaNumero ? 'disabled' : ''}>${abertas.map(c => `<option value="${c.numero}" ${c.numero === comandaNumero ? 'selected' : ''}>#${pad(c.numero)} · ${esc(c.cliente.nome)} · mesa ${c.mesa}</option>`).join('') || '<option value="">Nenhuma comanda aberta</option>'}</select>
    <label>Quantidade</label><div class="qty"><button id="mn" aria-label="Diminuir">−</button><b id="q">1</b><button id="pl" aria-label="Aumentar">+</button></div>
    <div class="line" style="margin-top:16px"><span>Preço</span><span id="pr"></span></div>
    <div class="line"><b>Subtotal</b><b id="st"></b></div>
    <div class="actions"><button class="btn ghost" data-close>Cancelar</button><button class="btn" id="go" ${abertas.length ? '' : 'disabled'}>Adicionar à comanda</button></div>`);
  const $ = s => m.el.querySelector(s);
  let q = 1;
  const draw = () => {
    const p = disp.find(x => x.id === Number($('#p').value));
    $('#q').textContent = q; $('#mn').disabled = q <= 1;
    $('#pr').textContent = brl(p.preco); $('#st').textContent = brl(p.preco * q);
  };
  $('#p').onchange = draw;
  $('#mn').onclick = () => { q--; draw(); };
  $('#pl').onclick = () => { q++; draw(); };
  $('#go').onclick = async () => {
    const r = await act(() => adicionarProduto(Number($('#c').value), Number($('#p').value), q), 'Produto adicionado.');
    if (r) { m.close(); onDone?.(r); }
  };
  draw();
}
