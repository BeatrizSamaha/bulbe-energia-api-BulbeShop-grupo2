## Endpoints Mapeados

| Verbo | Path | Issue | Status | Descrição |
|--------|------------------------|-------|---------|-----------|
| **PRODUTOS** | | | | |
| GET | `/api/v1/produtos` | US-01 | 200 | listar produtos na página inicial |
| GET | `/api/v1/produtos/:id` | US-02 | 200, 404 | buscar produto por id |
| GET | `/api/v1/produtos?categoria={id}`| US-03 | 200 | listar produtos por categoria |
| **CARRINHO** | | | | |
| POST | `/api/v1/carrinho` | US-04 | 201, 400 | adicionar produto ao carrinho |
| GET | `/api/v1/carrinho` | US-05 | 200 | listar itens do carrinho |
| DELETE | `/api/v1/carrinho/:id` | US-06 | 204, 404 | remover item do carrinho |
| PUT | `/api/v1/carrinho/:id` | US-07 | 200, 400 | atualizar quantidade de item no carrinho |
| **FAVORITOS** | | | | |
| POST | `/api/v1/favoritos` | US-08 | 201, 400 | favoritar produto |
| GET | `/api/v1/favoritos` | US-09 | 200 | listar produtos favoritos |
| **CHECKOUT E PAGAMENTO** | | | | |
| POST | `/api/v1/pedidos` | US-10 | 201, 400 | iniciar checkout |
| POST | `/api/v1/pagamentos/pix` | US-11 | 200, 422 | processar pagamento via pix |
| POST | `/api/v1/pagamentos/boleto` | US-12 | 200, 422 | processar pagamento via boleto |
| POST | `/api/v1/pagamentos/cartao` | US-13 | 200, 422 | processar pagamento via cartão |
| **USUÁRIO E AUTENTICAÇÃO**| | | | |
| GET | `/api/v1/usuarios/perfil` | US-14 | 200, 401 | visualizar perfil do usuário |
| PUT | `/api/v1/usuarios/perfil` | US-14 | 200, 400 | editar perfil do usuário |
| GET | `/api/v1/usuarios/pontos` | US-15 | 200, 401 | consultar pontos bulbe do usuário |
| POST | `/api/v1/auth/login` | US-18 | 200, 401 | autenticar usuário via login |
| **OUTROS** | | | | |
| GET | `/api/v1/cupons` | US-16 | 200 | listar cupons disponíveis |
| GET | `/api/v1/lojas-parceiras` | US-17 | 200 | listar lojas parceiras |
