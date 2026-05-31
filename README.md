# 🛍️ ComerziaHub

**Plataforma completa de estoque, delivery, marketplace e rede social comercial** — para lojas, vendedores, compradores e entregadores.

ComerziaHub reúne, em um só sistema, um **controle de estoque**, um **aplicativo de delivery**, um **marketplace multi-lojas**, um **painel administrativo**, uma **rede social comercial**, além de **cashback**, **fidelidade** e **acompanhamento de pedidos**.

> ⚠️ Projeto de referência / base real de um sistema completo. Vários módulos já são funcionais ponta a ponta; outros têm o modelo de dados e a estrutura prontos, com a UI completa no roadmap. Veja [Status das funcionalidades](#-status-das-funcionalidades).

---

## 📚 Sumário

- [Tecnologias](#-tecnologias)
- [Perfis de usuários](#-perfis-de-usuários)
- [Status das funcionalidades](#-status-das-funcionalidades)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Como rodar localmente](#-como-rodar-localmente)
- [Banco de dados, migrations e seed](#-banco-de-dados-migrations-e-seed)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Deploy na Vercel](#-deploy-na-vercel)
- [Credenciais de teste](#-credenciais-de-teste)
- [Roadmap](#-roadmap)

---

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** (App Router) — frontend + backend (Server Components, Server Actions, Route Handlers)
- **TypeScript**
- **[Prisma ORM](https://www.prisma.io/)** + **MySQL / MariaDB** (compatível com **XAMPP/phpMyAdmin**; PostgreSQL também funciona trocando o `provider` em `schema.prisma`)
- **[Auth.js / NextAuth v5](https://authjs.dev/)** — autenticação por credenciais com papéis (RBAC) e proteção de rotas via middleware
- **[Tailwind CSS](https://tailwindcss.com/)** — identidade visual própria, responsiva
- **[Zod](https://zod.dev/)** — validação de dados
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — hash de senhas
- **[lucide-react](https://lucide.dev/)** — ícones
- Arquitetura organizada em módulos (`app`, `components`, `lib`, `services`, `actions`, `types`, `prisma`).

---

## 👥 Perfis de usuários

Cada papel tem permissões e painel próprios (protegidos por middleware):

| Papel | Acesso | Painel |
|------|--------|--------|
| **Administrador** (`ADMIN`) | Tudo | `/admin` |
| **Moderador** (`MODERATOR`) | Rede social / denúncias | `/admin/social` |
| **Dono de loja** (`STORE_OWNER`) | Painel da loja | `/dashboard` |
| **Funcionário** (`STORE_EMPLOYEE`) | Painel da loja | `/dashboard` |
| **Vendedor** (`SELLER`) | Painel da loja | `/dashboard` |
| **Cliente** (`CUSTOMER`) | Área do cliente | `/account` |
| **Entregador** (`COURIER`) | Painel do entregador | `/courier` |

---

## ✅ Status das funcionalidades

### Funcionais (ponta a ponta)
- **Autenticação**: cadastro, login, logout, recuperação de senha (geração de token), proteção de rotas por papel, redirecionamento por perfil.
- **Marketplace**: home com destaques, busca, filtros (categoria, preço, ordenação), página pública de loja, página de produto (promoção, variações, avaliações).
- **Carrinho & checkout**: adicionar/alterar/remover itens, entrega ou retirada, seleção de endereço, método de pagamento, divisão automática por loja.
- **Pedidos**: criação, baixa de estoque, histórico de status, página pública de acompanhamento com timeline.
- **Painel da loja**: visão geral, onboarding de criação de loja, funil de pedidos (aceitar → preparar → pronto → entrega → concluir), cadastro/listagem de produtos, estoque, clientes, configuração de cashback, configurações de entrega/horário.
- **Painel admin**: dashboard com métricas, aprovação/suspensão de lojas, gestão de usuários, pedidos, planos, financeiro, denúncias, moderação de publicações.
- **Área do cliente**: visão geral, pedidos, endereços (cadastro), saldo de cashback, fidelidade/emblemas, favoritos, lojas seguidas.
- **Painel do entregador**: status online/offline, entregas disponíveis, aceite e avanço de entrega (coletei/entreguei), ganhos.
- **Rede social**: feed, publicações (texto/produto/promoção), curtidas, seguir lojas.
- **Cashback & fidelidade**: regras por loja, cashback gerado automaticamente no pedido, carteira por loja, níveis (Bronze→VIP) calculados por compras/gasto.

### Estrutura pronta (modelo de dados + UI base, completar no roadmap)
- Upload de imagens (hoje por URL), mensagens privadas, comentários aninhados, amizades/conexões, denúncias com fluxo completo, cupons (criação), editor de níveis de fidelidade, integração com gateway de pagamento e mapas.

---

## 🗂️ Estrutura de pastas

```
.
├── app/                      # Rotas (App Router)
│   ├── (public)/             # Site público: home, marketplace, loja, produto, carrinho, checkout, feed, pedido
│   ├── (auth)/               # Login, cadastro, recuperação de senha
│   ├── admin/                # Painel do administrador
│   ├── dashboard/            # Painel da loja
│   ├── account/              # Área do cliente
│   ├── courier/              # Painel do entregador
│   └── api/auth/             # Route handler do Auth.js
├── actions/                  # Server Actions (auth, cart, orders, store, courier, account, social, admin)
├── components/               # UI, layout, commerce, social, dashboard, auth
├── lib/                      # prisma, auth, rbac, utils, validations, delivery, cashback, loyalty, constants
├── services/                 # Consultas ao banco (catalog, social, orders, cart, store, stats)
├── prisma/                   # schema.prisma + seed.ts
├── styles/                   # globals.css
├── types/                    # tipos compartilhados + augmentation do next-auth
└── middleware.ts             # Proteção de rotas por papel (Edge)
```

---

## 💻 Como rodar localmente

### Pré-requisitos
- **Node.js 18.18+** (recomendado 20 ou 22)
- **MySQL 8 / MariaDB 10.4+** — ex.: **XAMPP** (phpMyAdmin) rodando localmente. Para produção: PlanetScale, Railway, Aiven, etc.

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
#   edite .env e preencha DATABASE_URL e AUTH_SECRET
#   gere um segredo: npx auth secret   (ou)  openssl rand -base64 32

# 3. Crie as tabelas no banco
npm run db:push          # rápido (sem histórico de migrations)
#   ou, para gerar migrations versionadas:
npm run db:migrate

# 4. Popule com dados de exemplo
npm run db:seed

# 5. Rode em desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

### Banco com XAMPP (phpMyAdmin)

1. No **XAMPP Control Panel**, dê **Start** em **Apache** e **MySQL**.
2. Em http://localhost/phpmyadmin crie um banco **`estoque_delivery`** (collation `utf8mb4_unicode_ci`).
3. No `.env`: `DATABASE_URL="mysql://root@localhost:3306/estoque_delivery"` *(root sem senha é o padrão do XAMPP)*.
4. `npm run db:push` cria as tabelas e `npm run db:seed` popula os dados — visíveis depois no phpMyAdmin.

---

## 🗄️ Banco de dados, migrations e seed

| Comando | Descrição |
|---------|-----------|
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:push` | Sincroniza o schema com o banco (sem migrations) |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica migrations em produção |
| `npm run db:seed` | Popula dados fictícios (usuários, lojas, produtos, pedidos, posts) |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run db:reset` | **Apaga** e recria o banco + seed |

O **schema** (`prisma/schema.prisma`) cobre ~40 modelos: usuários, perfis, permissões, lojas, funcionários, produtos, categorias, variações, estoque/movimentações, carrinho, pedidos, itens, pagamentos, entregas, entregadores, endereços, avaliações, cashback (regras/transações/carteira), fidelidade (níveis/status/emblemas), cupons, publicações, comentários, curtidas, seguidores, amizades, mensagens, notificações, denúncias, planos, assinaturas e configurações.

---

## 🔐 Variáveis de ambiente

Copie `.env.example` para `.env`. Principais:

| Variável | Obrigatória | Descrição |
|----------|:----------:|-----------|
| `DATABASE_URL` | ✅ | String de conexão MySQL/MariaDB (ex.: `mysql://root@localhost:3306/estoque_delivery`) |
| `AUTH_SECRET` | ✅ | Segredo do Auth.js (`npx auth secret`) |
| `AUTH_URL` / `NEXTAUTH_URL` | ⚠️ | URL pública (produção) |
| `NEXT_PUBLIC_APP_URL` | — | URL pública do app |
| `NEXT_PUBLIC_MAPS_*` | — | Integração futura com mapas |
| `UPLOAD_PROVIDER` | — | Provedor de upload (futuro) |
| `PAYMENT_PROVIDER` | — | Gateway de pagamento (futuro) |

> O app é resiliente: as páginas públicas renderizam mesmo sem banco configurado (mostram estados vazios), permitindo um primeiro deploy antes de conectar o banco.

---

## ▲ Deploy na Vercel

1. **Importe o repositório** do GitHub na Vercel (framework detectado automaticamente: Next.js).
2. **Banco de dados**: provisione um **MySQL** gerenciado (PlanetScale, Railway, Aiven…) e copie a connection string.
3. **Variáveis de ambiente** no projeto da Vercel:
   - `DATABASE_URL` = sua connection string MySQL (provedores gerenciados costumam exigir SSL, ex.: `?sslaccept=strict`)
   - `AUTH_SECRET` = segredo aleatório
   - `AUTH_URL` / `NEXTAUTH_URL` = URL do deploy (ex.: `https://comerziahub.vercel.app`)
4. **Build**: o comando padrão (`prisma generate && next build`) já está em `package.json`.
5. Após o primeiro deploy, **aplique o schema e o seed** apontando para o banco de produção:
   ```bash
   DATABASE_URL="<sua-url-de-producao>" npm run db:deploy   # ou db:push
   DATABASE_URL="<sua-url-de-producao>" npm run db:seed
   ```

---

## 🧪 Credenciais de teste

Disponíveis após rodar `npm run db:seed`. **Senha de todas:** `senha123`

| Perfil | E-mail |
|--------|--------|
| Administrador | `admin@comerziahub.com` |
| Moderador | `moderador@comerziahub.com` |
| Dono de loja | `loja@comerziahub.com` |
| Dono de loja | `loja2@comerziahub.com` |
| Funcionário | `funcionario@comerziahub.com` |
| Cliente | `cliente@comerziahub.com` |
| Cliente | `cliente2@comerziahub.com` |
| Entregador | `entregador@comerziahub.com` |

---

## 🛣️ Roadmap

- [ ] Upload real de imagens (Vercel Blob / S3 / Cloudinary)
- [ ] Integração com gateway de pagamento (Pix, cartão) — Stripe / Mercado Pago
- [ ] Mapa em tempo real para rastreio de entrega (Google Maps / Mapbox)
- [ ] Mensagens privadas em tempo real e notificações push
- [ ] Comentários aninhados, compartilhamentos e conexões/amizades
- [ ] Fluxo completo de denúncias e bloqueio de usuários
- [ ] Editor visual de níveis de fidelidade e campanhas de cupom
- [ ] OAuth (Google/Apple) — modelos do adapter já incluídos
- [ ] Relatórios financeiros avançados e exportação
- [ ] Testes automatizados (unit/e2e) e ESLint configurado
- [ ] App mobile (React Native) consumindo a mesma base

---

## 📄 Licença

Projeto de demonstração / base de referência. Use livremente como ponto de partida.

Feito com Next.js, Prisma e Tailwind CSS. 💜
