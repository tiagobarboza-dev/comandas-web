import { icon, empty, loading } from './components/ui.js';
import { getComandas } from './services/comandaService.js';
import * as dashboard from './pages/dashboard.js';
import * as clientes from './pages/clientes.js';
import * as comandas from './pages/comandas.js';
import * as detalhe from './pages/comandaDetalhe.js';
import * as cardapio from './pages/cardapio.js';
import * as relatorios from './pages/relatorios.js';

const pages = { dashboard, clientes, comandas, cardapio, relatorios };
const NAV = [['dashboard', 'Dashboard', 'grid'], ['clientes', 'Clientes', 'users'], ['comandas', 'Comandas', 'receipt'], ['cardapio', 'Cardápio', 'book'], ['relatorios', 'Relatórios', 'chart']];

const view = document.getElementById('view');
document.getElementById('nav').innerHTML = NAV.map(([k, l, i]) => `<a href="#/${k}" data-k="${k}">${icon(i)}${l}</a>`).join('');
document.getElementById('burger').innerHTML = icon('menu', 22);
document.getElementById('sicon').innerHTML = icon('search');
document.getElementById('burger').onclick = () => document.body.classList.toggle('nav');
document.getElementById('gsearch').onsubmit = e => {
  e.preventDefault();
  location.hash = '#/clientes?q=' + encodeURIComponent(e.target.q.value);
};

async function route() {
  const [path, qs = ''] = location.hash.slice(2).split('?');
  const [page = 'dashboard', id] = path.split('/');
  document.body.classList.remove('nav');
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.k === page));
  const mod = page === 'comandas' && id ? detalhe : pages[page] || dashboard;
  loading(view);
  try { await mod.render(view, { id, ...Object.fromEntries(new URLSearchParams(qs)) }); }
  catch (e) { view.innerHTML = empty('inbox', e.message, '<a class="btn" href="#/dashboard">Voltar ao início</a>'); }
  refreshBadge();
}
export async function refreshBadge() {
  const cs = await getComandas().catch(() => []);
  document.getElementById('badge').textContent = cs.filter(c => c.aberta).length;
}
addEventListener('hashchange', route);
route();
