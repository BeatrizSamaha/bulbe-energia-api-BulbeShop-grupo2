import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Import das ROTAS
import cuponsRouter from "./routes/cupons.js";
import lojasRouter from "./routes/lojas.js";
import authRouter from "./routes/auth.js";
import pedidosRouter from "./routes/pedidos.js";
import pagamentosRouter from "./routes/pagamentos.js";
import favoritosRouter from './routes/favoritos.js';
import produtosRouter from './routes/produtos.js';
import carrinhoRouter from './routes/carrinho.js';
import categoriasRouter from './routes/categorias.js';
import usuariosRouter from './routes/usuarios.js';

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bulbe Energia API",
      version: "1.0.0",
      description: "API do Projeto Bulbe Energia",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/produtos", produtosRouter);
app.use("/api/v1/categorias", categoriasRouter);
app.use("/api/v1/cupons", cuponsRouter);
app.use("/api/v1/lojas-parceiras", lojasRouter); // [IMP-29] corrigido para lojas-parceiras
app.use("/api/v1/pedidos", pedidosRouter);
app.use('/api/v1/carrinho', carrinhoRouter);
app.use('/api/v1/pagamentos', pagamentosRouter);
app.use('/api/v1/favoritos', favoritosRouter);
app.use('/api/v1/usuarios', usuariosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});