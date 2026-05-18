// Este arquivo de rotas não está montado no app.js.
// O processamento de pagamento é feito via:
//   POST /api/v1/pedidos/:id/pagamento/pix
//   POST /api/v1/pedidos/:id/pagamento/boleto
//   POST /api/v1/pedidos/:id/pagamento/cartao
//
// A documentação Swagger dessas rotas está em src/routes/pedidos.js.

import { Router } from 'express';
const router = Router();
export default router;