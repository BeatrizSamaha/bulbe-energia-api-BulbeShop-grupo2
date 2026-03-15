<div align="center">

# Bulbe Energia API

**Backend do sistema de e-commerce de produtos sustentáveis**
Projeto desenvolvido para a disciplina de Projeto de Desenvolvimento Backend — IBMEC

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## Equipe

| Nome Completo | Matrícula | GitHub |
|---|---|---|
| Beatriz Samaha | [202501006337] | [@BeatrizSamaha](https://github.com/BeatrizSamaha) |
| Júlia Leal | [202501681451] | [@bjulialeal](https://github.com/bjulialeal) |
| Bruna Cruz | [202501007511] | [@brunabcruz](https://github.com/brunabcruz) |
| Pedro Paulucci | [202501246982] | [@pedropaulucci27](https://github.com/pedropaulucci27) |
| Tiago Heitzmann | [202602597586] | [@Theitzmann](https://github.com/Theitzmann) |
| Tiago Lage Bacha | [202508012456] | [@TiagoLageBacha](https://github.com/TiagoLageBacha) |

---

## Sobre o Projeto

A Bulbe Energia API é o backend do projeto BulbeShop, um e-commerce, criado para a empresa de energia Bulbe, focado em produtos sustentáveis e de economia de energia. A API fornece os recursos necessários para que o frontend, feito no semestre anterior,  consuma dados de produtos, gerencie carrinhos de compra, processe pedidos e pagamentos, e gerencie perfis de usuário. O projeto é desenvolvido em Node.js seguindo a arquitetura MVC, com autenticação via JWT.

---

## Arquitetura

> A ser preenchido na Sprint 2 após definição da arquitetura MVC.

---

## Tecnologias

> A ser preenchido na Sprint 2.

---

## Como Executar Localmente

> A ser preenchido na Sprint 2.

---

## Endpoints da API

> Consulte o arquivo completo em [docs/requisitos.md](./docs/requisitos.md).

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

---

## Documentacao OpenAPI

> Arquivo em [docs/openapi.yaml](./docs/openapi.yaml) — a ser preenchido progressivamente.

---

## Estrutura do Repositorio
```
bulbe-energia-api-BulbeShop-grupo2/
├── docs/
│   ├── requisitos.md
│   └── openapi.yaml
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── tests/
├── .gitignore
├── package.json
└── README.md
```

---

## Sprints

| Sprint | Foco | Status |
|--------|------|--------|
| Kickoff | Apresentacao dos trabalhos do semestre anterior | Concluida |
| Sprint 1 | Setup e Elicitacao de Requisitos | Em andamento |
| Sprint 2 | Modelagem e Arquitetura e CRUD basico | Aguardando |
| Sprint 3 | Banco de Dados e ORM e Testes | Aguardando |
| Sprint 4 | Autenticacao e Documentacao Final | Aguardando |

---

## Referencias

- SOMMERVILLE, I. Software Engineering. 10. ed. Pearson, 2015.
- FOWLER, M. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.
- RICHARDSON, L.; RUBY, S. RESTful Web Services. O'Reilly, 2007.
- OpenAPI Initiative. OpenAPI Specification v3.1.0. Disponivel em: https://spec.openapis.org/oas/v3.1.0

---

## Licenca

Distribuido sob a licenca MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.