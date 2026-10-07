export const brl = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
export const pad = n => String(n).padStart(3, '0');
export const qtdItens = c => c.itens.reduce((s, i) => s + i.quantidade, 0);
export const hora = t => new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
export const tempo = t => {
  const m = Math.max(0, Math.floor((Date.now() - t) / 60000));
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
};
