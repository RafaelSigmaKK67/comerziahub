# 📸 Screenshots — ComerziaHub

Capturas reais do sistema em execução (`npm run dev`) com dados carregados do
**banco local MySQL/MariaDB do XAMPP** (`estoque_delivery`). Geradas com Puppeteer
usando o Chrome instalado (`scripts/screenshots.mjs`).

> Tema padrão: **escuro (cibernético)**. As duas últimas imagens demonstram o
> tema claro e o layout responsivo (mobile).

| # | Arquivo | Tela | O que mostra |
|---|---------|------|--------------|
| 01 | `01-home.png` | Página inicial | Hero, busca, pilares (estoque/delivery/marketplace/social), lojas e produtos em destaque. |
| 02 | `02-login.png` | Login | Tela de acesso com painel lateral e contas de demonstração. |
| 03 | `03-register.png` | Cadastro | Criação de conta com escolha de perfil (cliente, loja, vendedor, entregador). |
| 04 | `04-marketplace.png` | Marketplace | Busca, filtros (categoria/preço/ordenação) e grade de produtos/lojas. |
| 05 | `05-store-page.png` | Página/Perfil da loja | Banner, logo, avaliações, métricas e catálogo da loja (perfil social da loja). |
| 06 | `06-product-page.png` | Página de produto | Galeria, preço/promoção, variações, cashback e avaliações. |
| 07 | `07-cart.png` | Carrinho | Item adicionado, quantidades e resumo do pedido. |
| 08 | `08-checkout.png` | Checkout | Entrega/retirada, endereço, forma de pagamento e resumo. |
| 09 | `09-order-tracking.png` | Acompanhamento de pedido | Linha do tempo do pedido, itens, entrega e pagamento. |
| 10 | `10-social-feed.png` | Feed da rede social | Publicações de lojas e usuários, curtidas e comentários. |
| 11 | `11-admin-dashboard.png` | Dashboard administrativo | Métricas da plataforma, pedidos recentes e lojas pendentes. |
| 12 | `12-admin-stores.png` | Admin · Lojas | Aprovação/suspensão de lojas. |
| 13 | `13-admin-users.png` | Admin · Usuários | Gestão de usuários e papéis. |
| 14 | `14-store-dashboard.png` | Painel da loja | Visão geral: funil de pedidos, produtos, clientes e faturamento. |
| 15 | `15-store-products.png` | Loja · Produtos | Lista de produtos do catálogo da loja. |
| 16 | `16-store-inventory.png` | Loja · Estoque | Controle de estoque e situação por produto. |
| 17 | `17-store-cashback.png` | Loja · Cashback | Configuração da campanha de cashback. |
| 18 | `18-customer-account.png` | Perfil do cliente | Visão geral: pedidos, favoritos, lojas seguidas e cashback. |
| 19 | `19-customer-cashback.png` | Cliente · Cashback | Saldo por loja e histórico de transações. |
| 20 | `20-loyalty-badges.png` | Cliente · Fidelidade | Níveis por loja e emblemas conquistados. |
| 21 | `21-messages.png` | Mensagens | Conversa privada entre comprador e vendedor. |
| 22 | `22-courier-dashboard.png` | Painel do entregador | Status online/offline, entregas e ganhos. |
| 23 | `23-courier-deliveries.png` | Entregador · Entregas | Entregas disponíveis e ativas (aceitar/avançar). |
| 24 | `24-settings.png` | Configurações | Dados do perfil e preferências. |
| 25 | `25-home-light.png` | Tema claro | Página inicial no tema claro (toggle sol/lua). |
| 26 | `26-home-mobile.png` | Mobile | Layout responsivo da home no celular (tema escuro). |

## Como regenerar

```bash
# 1. XAMPP rodando (Apache + MySQL) e banco populado (npm run db:seed)
# 2. Suba o app
npm run dev
# 3. Em outro terminal, instale o puppeteer (uma vez) e rode o script
npm install puppeteer --no-save
node scripts/screenshots.mjs
```

O script faz login com as contas de demonstração (senha `senha123`), navega pelas
telas e salva os PNGs nesta pasta. Ele usa o Chrome instalado no sistema.
