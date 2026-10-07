import { getProdutos } from '../services/comandaService.js';
import { openAddProduct } from '../components/addProductModal.js';
import { empty, esc } from '../components/ui.js';
import { brl } from '../utils/format.js';
import { CATEGORIAS } from '../models/index.js';

export async function render(el) {
  const prods = await getProdutos();
  let cat = 'Todos';
  el.innerHTML = `<div class="head"><div><h1>Cardápio</h1><p>Escolha um item e envie para uma comanda aberta.</p></div></div>
    <div class="chips" id="chips">${['Todos', ...CATEGORIAS].map(k => `<button class="chip ${k === 'Todos' ? 'on' : ''}" data-c="${k}">${k}</button>`).join('')}<input class="input" id="s" placeholder="Buscar produto…" aria-label="Buscar produto"></div><div id="grid"></div>`;
  const s = el.querySelector('#s');
  const paint = () => {
    const t = s.value.trim().toLowerCase();
    const f = prods.filter(p => (cat === 'Todos' || p.categoria === cat) && p.nome.toLowerCase().includes(t));
    el.querySelector('#grid').innerHTML = f.length ? `<div class="grid cards">${f.map(p => `<div class="card prod"><span class="cat">${p.categoria}</span><h3>${esc(p.nome)}</h3>
      <span class="mut">${p.disponivel ? 'Disponível' : 'Indisponível'}</span><span class="tot">${brl(p.preco)}</span>
      <button class="btn" data-a="${p.id}" ${p.disponivel ? '' : 'disabled'}>Adicionar</button></div>`).join('')}</div>` : empty('book', 'Nenhum produto encontrado.');
  };
  el.querySelector('#chips').onclick = e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    cat = b.dataset.c;
    el.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b));
    paint();
  };
  el.querySelector('#grid').onclick = e => {
    const b = e.target.closest('[data-a]');
    if (b) openAddProduct({ produto: prods.find(p => p.id === Number(b.dataset.a)) });
  };
  s.oninput = paint;
  paint();
}
