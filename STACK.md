# 🧩 Stack & Plataformas — ComerziaHub

> Documento vivo: **atualizado conforme o projeto evolui**. Veja o
> [Histórico de atualizações](#-histórico-de-atualizações) no fim.
>
> **Última atualização:** 2026-05-31

Plataforma de **estoque + delivery + marketplace + rede social comercial**.

---

## 🛠️ Stack (código)

| Camada | Tecnologia |
|--------|-----------|
| Framework (front + back) | **Next.js 15** — App Router, Server Components, Server Actions, Route Handlers |
| Linguagem | **TypeScript** |
| Estilização | **Tailwind CSS** (tema cibernético, claro/escuro com toggle) |
| ORM | **Prisma** (~40 modelos) |
| Autenticação | **Auth.js / NextAuth v5** — credenciais, papéis (RBAC), proteção via `middleware` |
| Segurança/validação | **bcryptjs** (hash de senha), **Zod** (validação) |
| UI/Ícones | **lucide-react**, **clsx**, **tailwind-merge**, **date-fns** |

## 🗄️ Banco de dados — **MySQL / MariaDB**

| Ambiente | Onde | Detalhe |
|----------|------|---------|
| Local | **XAMPP / phpMyAdmin** | banco `estoque_delivery` (`localhost:3306`) |
| Produção | **Aiven** (MySQL gerenciado) | configurado via env `DATABASE_URL` na Vercel |

## ☁️ Plataformas / hospedagem

- **GitHub** — repositório e versionamento: `RafaelSigmaKK67/comerziahub`
- **Vercel** — deploy/hospedagem de produção (deploy automático a cada push no `main`) → **https://comerziahub.vercel.app**
- **Aiven** — banco MySQL de produção

## 🧰 Ferramentas de apoio

- **Node.js 22** (runtime) · **npm** (gerenciador de pacotes) · **Git**
- **Puppeteer + Chrome** — captura automática de screenshots (`scripts/screenshots.mjs`)
- Scripts utilitários: `scripts/sync-prod-db.mjs` (sincroniza env na Vercel), `scripts/test-auth.mjs` (teste e2e de cadastro/login)

## 🗂️ Arquitetura (pastas)

```
app/         # rotas e telas (público, auth, admin, dashboard, account, courier)
actions/     # Server Actions (auth, cart, orders, store, courier, account, social, messages, admin)
components/  # UI, layout, commerce, social, dashboard, auth, theme-toggle
lib/         # prisma, auth, rbac, utils, validations, delivery, cashback, loyalty, constants
services/    # consultas ao banco (catalog, social, orders, cart, store, stats, messages)
prisma/      # schema.prisma + seed.ts
styles/      # globals.css (tema)
middleware.ts# proteção de rotas por papel (RBAC)
```

## 🔐 Variáveis de ambiente principais

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | conexão MySQL (XAMPP local / Aiven em produção) |
| `AUTH_SECRET` | segredo do Auth.js |
| `AUTH_URL` / `NEXTAUTH_URL` | URL da aplicação |
| `NEXT_PUBLIC_APP_URL` | URL pública |

## ▶️ Scripts npm úteis

```bash
npm run dev          # desenvolvimento (localhost:3000)
npm run build        # build de produção (prisma generate + next build)
npm run db:push      # aplica o schema no banco
npm run db:seed      # popula dados de exemplo
npm run db:studio    # Prisma Studio
```

## ✅ Estado atual

Funcionando **local (XAMPP)** e **produção (Vercel + Aiven)**: cadastro/login, marketplace,
loja/produto, carrinho/checkout, pedidos, painéis (admin/loja/cliente/entregador),
feed social, mensagens, cashback e fidelidade. Tema cibernético com alternância claro/escuro.

---

## 📜 Histórico de atualizações

- **2026-05-31** — Tema cibernético + alternância claro/escuro (localStorage); página de **Mensagens** (comprador × vendedor); **produção no ar** (Vercel + Aiven MySQL) com cadastro/login validados; correção de compatibilidade MySQL 8 (PK em `VerificationToken`); seed enriquecido (cupons, emblemas, cashback, conversa); 26 screenshots reais.
- **2026-05-30** — Criação do projeto: Next.js 15 + Prisma + Auth.js + Tailwind; schema com ~40 modelos; painéis e telas principais; seed inicial; repositório no GitHub + deploy inicial na Vercel; migração de PostgreSQL para **MySQL/MariaDB** (XAMPP).

> Ao adicionar/trocar tecnologias, bancos, integrações ou módulos, **registre aqui** uma nova entrada com a data.
