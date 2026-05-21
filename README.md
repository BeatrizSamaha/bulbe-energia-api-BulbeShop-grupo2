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

A Bulbe Energia API é o backend do projeto BulbeShop, um e-commerce criado para a empresa de energia Bulbe, focado em produtos sustentáveis e de economia de energia. A API fornece os recursos necessários para que o frontend consuma dados de produtos, gerencie carrinhos de compra, processe pedidos e pagamentos, e gerencie perfis de usuário.

---

## Arquitetura

A API foi desenvolvida baseada no padrão arquitetural MVC adaptado para APIs. A estrutura é dividida em rotas (`routes/`), controladores (`controllers/`), validação de dados (`validators/`), middlewares de segurança e tratamento (`middlewares/`), e configuração/interação com o banco de dados (`db/`).

---

## Tecnologias

- **Linguagem:** JavaScript (Node.js)
- **Framework:** Express
- **Banco de Dados:** SQLite (`better-sqlite3`)
- **Autenticação e Segurança:** JWT (`jsonwebtoken`) e hash de senhas (`bcryptjs`)
- **Validação de Dados:** Zod
- **Documentação:** Swagger (`swagger-jsdoc` e `swagger-ui-express`)
- **Utilitários:** `dotenv`, `nodemon`

---

## Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina:

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie e popule o banco de dados inicial (seeding):
   ```bash
   npm run seed
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

A API estará rodando por padrão em `http://localhost:3000`.

---

## Documentação Interativa (Swagger)

A documentação interativa completa dos endpoints (OpenAPI/Swagger) pode ser acessada através do navegador após iniciar o servidor em:
**`http://localhost:3000/api-docs`**

---

## Estrutura do Repositório

```text
bulbe-energia-api-BulbeShop-grupo2/
├── docs/                # Documentação de requisitos e user stories
├── src/                 # Código fonte da aplicação
│   ├── config/          # Configurações globais (ex: auth)
│   ├── controllers/     # Lógica de controle de requisições
│   ├── db/              # Conexão com banco SQLite e seeds
│   ├── middlewares/     # Middlewares (autenticação, validação)
│   ├── routes/          # Definição das rotas da API
│   └── validators/      # Schemas de validação com Zod
├── .gitignore
├── package.json
└── README.md
```

---

## Sprints

| Sprint | Foco | Status |
|--------|------|--------|
| Kickoff | Apresentação dos trabalhos do semestre anterior | Concluída |
| Sprint 1 | Setup e Elicitação de Requisitos | Concluída |
| Sprint 2 | Modelagem e Arquitetura e CRUD básico | Concluída |
| Sprint 3 | Banco de Dados e ORM e Testes | Em andamento |
| Sprint 4 | Autenticação e Documentação Final | Aguardando |

---

## Referências

- SOMMERVILLE, I. Software Engineering. 10. ed. Pearson, 2015.
- FOWLER, M. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.
- RICHARDSON, L.; RUBY, S. RESTful Web Services. O'Reilly, 2007.
- OpenAPI Initiative. OpenAPI Specification v3.1.0. Disponível em: https://spec.openapis.org/oas/v3.1.0

---

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.