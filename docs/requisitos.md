| Verbo | Path | Descrição |
|-------|------|-----------|
| POST | /api/v1/auth/login | Autenticar usuário |
| GET | /api/v1/produtos | Listar produtos |
| GET | /api/v1/produtos/:id | Buscar produto por ID |
| GET | /api/v1/produtos?categoria=:categoria | Listar por categoria |
| GET | /api/v1/carrinho | Listar itens do carrinho |
| POST | /api/v1/carrinho/itens | Adicionar item ao carrinho |
| PATCH | /api/v1/carrinho/itens/:id | Atualizar quantidade |
| DELETE | /api/v1/carrinho/itens/:id | Remover item do carrinho |
| GET | /api/v1/favoritos | Listar favoritos |
| POST | /api/v1/favoritos/:produtoId | Favoritar produto |
| DELETE | /api/v1/favoritos/:produtoId | Desfavoritar produto |
| POST | /api/v1/pedidos | Iniciar checkout |
| POST | /api/v1/pedidos/:id/pagamento/pix | Pagar via PIX |
| POST | /api/v1/pedidos/:id/pagamento/boleto | Pagar via boleto |
| POST | /api/v1/pedidos/:id/pagamento/cartao | Pagar via cartão |
| GET | /api/v1/usuarios/perfil | Ver perfil |
| PUT | /api/v1/usuarios/perfil | Editar perfil |
| GET | /api/v1/usuarios/pontos | Consultar pontos Bulbe |
| GET | /api/v1/cupons | Listar cupons |
| GET | /api/v1/lojas-parceiras | Listar lojas parceiras |
