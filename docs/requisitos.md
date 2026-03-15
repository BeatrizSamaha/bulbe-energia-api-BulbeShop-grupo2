# Levantamento de Requisitos — Bulbe Energia API

**Versão:** 1.0
**Data:** 14/03/2026
**Grupo:** BulbeShop — Grupo 2
**Integrantes:**
- Beatriz Samaha - 202501006337
- Bruna Cruz - 202501007511
- Júlia Leal - 202501681451
- Pedro Paulucci - 202501246982
- Tiago Heitzmann - 202602597586
- Tiago Lage Bacha - 202508012456

---

## Requisitos Funcionais

| ID    | Descrição                                                              | US Vinculada | Prioridade |
|-------|------------------------------------------------------------------------|--------------|------------|
| RF-01 | Retornar lista de produtos disponíveis para exibição na home           | US-01        | MUST       |
| RF-02 | Retornar detalhes completos de um produto pelo seu ID                  | US-02        | MUST       |
| RF-03 | Retornar produtos filtrados por categoria                              | US-03        | MUST       |
| RF-04 | Permitir adicionar produtos ao carrinho do usuário autenticado         | US-04        | MUST       |
| RF-05 | Retornar os itens do carrinho do usuário autenticado                   | US-05        | MUST       |
| RF-06 | Permitir remover itens do carrinho do usuário autenticado              | US-06        | MUST       |
| RF-07 | Permitir atualizar a quantidade de um item no carrinho                 | US-07        | MUST       |
| RF-08 | Permitir favoritar e desfavoritar produtos                             | US-08        | SHOULD     |
| RF-09 | Retornar lista de produtos favoritos do usuário autenticado            | US-09        | SHOULD     |
| RF-10 | Criar um pedido a partir dos itens do carrinho do usuário              | US-10        | MUST       |
| RF-11 | Processar pagamentos via PIX retornando QR Code                        | US-11        | SHOULD     |
| RF-12 | Processar pagamentos via boleto retornando código de barras            | US-12        | SHOULD     |
| RF-13 | Processar pagamentos via cartão e retornar status da transação         | US-13        | MUST       |
| RF-14 | Permitir visualizar e editar dados do perfil do usuário autenticado    | US-14        | SHOULD     |
| RF-15 | Retornar saldo de pontos Bulbe do usuário autenticado                  | US-15        | SHOULD     |
| RF-16 | Retornar cupons de desconto disponíveis para o usuário                 | US-16        | SHOULD     |
| RF-17 | Retornar lista de lojas parceiras cadastradas                          | US-17        | COULD      |
| RF-18 | Autenticar usuários via e-mail e senha retornando token JWT            | US-18        | MUST       |

---

## Mapa de Endpoints

| Verbo  | Path                                    | RF    | Status esperado |
|--------|-----------------------------------------|-------|-----------------|
| GET    | /api/v1/produtos                        | RF-01 | 200             |
| GET    | /api/v1/produtos/:id                    | RF-02 | 200, 404        |
| GET    | /api/v1/produtos?categoria=:categoria   | RF-03 | 200, 404        |
| POST   | /api/v1/carrinho/itens                  | RF-04 | 201, 422        |
| GET    | /api/v1/carrinho                        | RF-05 | 200             |
| DELETE | /api/v1/carrinho/itens/:id              | RF-06 | 204, 404        |
| PATCH  | /api/v1/carrinho/itens/:id              | RF-07 | 200, 404, 422   |
| POST   | /api/v1/favoritos/:produtoId            | RF-08 | 201, 404        |
| DELETE | /api/v1/favoritos/:produtoId            | RF-08 | 204, 404        |
| GET    | /api/v1/favoritos                       | RF-09 | 200             |
| POST   | /api/v1/pedidos                         | RF-10 | 201, 422        |
| POST   | /api/v1/pedidos/:id/pagamento/pix       | RF-11 | 200, 404, 422   |
| POST   | /api/v1/pedidos/:id/pagamento/boleto    | RF-12 | 200, 404, 422   |
| POST   | /api/v1/pedidos/:id/pagamento/cartao    | RF-13 | 200, 404, 422   |
| GET    | /api/v1/usuarios/perfil                 | RF-14 | 200, 401        |
| PUT    | /api/v1/usuarios/perfil                 | RF-14 | 200, 422        |
| GET    | /api/v1/usuarios/pontos                 | RF-15 | 200, 401        |
| GET    | /api/v1/cupons                          | RF-16 | 200             |
| GET    | /api/v1/lojas-parceiras                 | RF-17 | 200             |
| POST   | /api/v1/auth/login                      | RF-18 | 200, 401        |

---

## Requisitos Não-Funcionais

| ID     | Categoria        | Descrição                                                  |
|--------|------------------|------------------------------------------------------------|
| RNF-01 | Desempenho       | Endpoints de leitura respondem em menos de 300ms           |
| RNF-02 | Segurança        | Todas as rotas exceto login exigem token JWT               |
| RNF-03 | Manutenibilidade | Código segue ESLint e padrão arquitetural MVC              |
| RNF-04 | Disponibilidade  | API disponível 99,5% do tempo em ambiente de produção      |
| RNF-05 | Portabilidade    | API executável localmente via Node.js 18 ou superior       |