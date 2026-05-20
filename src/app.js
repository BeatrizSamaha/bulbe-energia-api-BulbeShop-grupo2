import 'dotenv/config';
import express    from 'express';
import rateLimit  from 'express-rate-limit';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi    from 'swagger-ui-express';

import authRouter       from './routes/auth.js';
import produtosRouter   from './routes/produtos.js';
import categoriasRouter from './routes/categorias.js';
import cuponsRouter     from './routes/cupons.js';
import lojasRouter      from './routes/lojas.js';
import carrinhoRouter   from './routes/carrinho.js';
import pedidosRouter    from './routes/pedidos.js';
import favoritosRouter  from './routes/favoritos.js';
import usuariosRouter   from './routes/usuarios.js';
import adminRouter      from './routes/admin.js';
import avaliacoesRouter from './routes/avaliacoes.js';

const app = express();
app.use(express.json());

// Rate limiting
const limiterGeral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente em alguns minutos.' },
});
const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { erro: 'Muitas tentativas de login. Aguarde 15 minutos.' },
});

app.use(limiterGeral);
app.use('/api/v1/auth', limiterAuth);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Bulbe Energia API', version: '1.0.0',
            description: 'API completa do Projeto Bulbe Energia' },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};
app.use('/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

// Rotas
app.use('/api/v1/auth',            authRouter);
app.use('/api/v1/produtos',        produtosRouter);
app.use('/api/v1/produtos',        avaliacoesRouter); // /:produtoId/avaliacoes
app.use('/api/v1/categorias',      categoriasRouter);
app.use('/api/v1/cupons',          cuponsRouter);
app.use('/api/v1/lojas-parceiras', lojasRouter);
app.use('/api/v1/carrinho',        carrinhoRouter);
app.use('/api/v1/pedidos',         pedidosRouter);
app.use('/api/v1/favoritos',       favoritosRouter);
app.use('/api/v1/usuarios',        usuariosRouter);
app.use('/api/v1/admin',           adminRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    erro: `Rota ${req.method} ${req.path} não encontrada.`,
  });
});

// Handler global de erros
app.use((err, req, res, _next) => {
  console.error('[Erro]', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌿 API rodando em http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
});