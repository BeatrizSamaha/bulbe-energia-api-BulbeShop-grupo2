import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import cuponsRouter from './routes/cupons.js';

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bulbe Energia API',
      version: '1.0.0',
      description: 'API do Projeto Bulbe Energia',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/api/v1/cupons', cuponsRouter);

import lojasRouter from './routes/lojas.js';

app.use('/api/v1/lojas', lojasRouter);

import authRouter from './routes/auth.js';

app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});