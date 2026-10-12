# 🍽️ Brasa & Sal — Web

Interface web para gestão de comandas de restaurante. Consome a API REST do projeto [brasa-sal-api](https://github.com/tiagobarboza-dev/brasa-sal-api).

## ✨ Funcionalidades

- **Dashboard** — visão geral do salão com KPIs e status de cada mesa em tempo real
- **Clientes** — cadastro, edição e abertura de comandas
- **Comandas** — adicionar/remover produtos, alterar quantidade, fechar e liberar mesa
- **Cardápio** — CRUD de produtos com controle de disponibilidade
- **Relatórios** — faturamento dos últimos 7 dias com gráfico de barras

## 🛠️ Stack

- HTML5 + CSS3
- JavaScript (ES Modules, vanilla — sem framework)
- Fetch API para comunicação com o backend
- Design responsivo

## 🏗️ Estrutura

```
comandas-web/
├── css/
│   └── styles.css            # Design system + estilos
├── js/
│   ├── api/
│   │   └── http.js           # Client HTTP (fetch)
│   ├── components/
│   │   ├── ui.js             # Componentes reutilizáveis
│   │   └── addProductModal.js
│   ├── models/
│   │   └── index.js          # Constantes e tipos
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── clientes.js
│   │   ├── comandas.js
│   │   ├── comandaDetalhe.js
│   │   ├── cardapio.js
│   │   └── relatorios.js
│   ├── services/
│   │   ├── comandaService.js
│   │   └── relatorioService.js
│   ├── utils/
│   │   └── format.js         # Formatadores (moeda, data)
│   └── main.js               # Roteador e bootstrap
└── index.html
```

## 🚀 Como rodar

### Pré-requisitos

- Backend [brasa-sal-api](https://github.com/tiagobarboza-dev/brasa-sal-api) rodando em `http://localhost:8080`
- VS Code com extensão **Live Server** (ou qualquer servidor estático)

### Passos

```bash
# 1. Clone o repo
git clone https://github.com/tiagobarboza-dev/comandas-web.git
cd comandas-web

# 2. Abra no VS Code
code .

# 3. Clique com botão direito em index.html
# → "Open with Live Server"
```

O site estará em `http://127.0.0.1:5500`

> ⚠️ **Importante:** o backend precisa estar rodando em `http://localhost:8080`. Veja as instruções no [repo do backend](https://github.com/tiagobarboza-dev/brasa-sal-api).

## 🎯 Arquitetura

### Separação de camadas

```
pages/      →  Renderizam a tela e escutam eventos
    ↓
services/   →  Funções de alto nível (agrupam chamadas)
    ↓
api/http.js →  Client HTTP (fetch + tratamento de erro)
    ↓
Backend Spring Boot
```

### Roteador

Roteamento via hash (`#/dashboard`, `#/clientes`, `#/comandas/:id`), implementado em `main.js` sem framework.

### Detecção de ambiente

O `http.js` detecta automaticamente se está rodando local ou online e aponta para a URL correta da API:

```js
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080/api'
  : 'https://sua-api-online.com/api';
```

## 🎨 Design

- Paleta terracota (`#B5482A`) com fundo creme (`#FAF8F4`)
- Tipografia: **Bricolage Grotesque** (títulos) + **Figtree** (corpo)
- Design system baseado em variáveis CSS
- Componentes: cards, modais, toasts, badges, tabelas, gráficos

## 🎯 Decisões de design

- **Sem framework** — JavaScript vanilla com ES Modules. Mais leve, mais didático.
- **Regras no backend** — o front nunca calcula total nem valida estado. Tudo vem da API.
- **Estados visuais claros** — loading, empty state, erro tratado.
- **Cache-buster** — requisições com timestamp para evitar cache do navegador em dados dinâmicos.

## 🔗 Backend

API REST: [brasa-sal-api](https://github.com/tiagobarboza-dev/brasa-sal-api)

## 👤 Autor

**Tiago Barboza**
- GitHub: [@tiagobarboza-dev](https://github.com/tiagobarboza-dev)
