import { Router } from "express";
import {
    buscarPedidoPorId,
    listarPedidos,
    iniciarCheckout,
    cancelarPedido,
    aplicarCupom,
} from "../controllers/pedidosController.js";
import {
    processarPagamentoPix,
    processarPagamentoBoleto,
    processarPagamentoCartao,
} from "../controllers/pagamentosController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @openapi
 *
 * /api/v1/pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Retorna os detalhes completos de um pedido específico. Requer autenticação JWT e valida se o pedido pertence ao usuário logado.
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do pedido.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do pedido retornados com sucesso.
 *       403:
 *         description: Acesso negado. O pedido não pertence ao usuário autenticado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.get("/:id", autenticar, buscarPedidoPorId);

/**
 * @openapi
 * /api/v1/pedidos:
 *   get:
 *     summary: Listar histórico de pedidos do usuário
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *
 *   post:
 *     summary: Inicia o checkout criando um pedido a partir do carrinho
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cupom:
 *                 type: string
 *                 example: 'BEMVINDO10'
 *                 description: Código de cupom de desconto (opcional)
 *     responses:
 *       '201':
 *         description: Pedido criado com sucesso.
 *       '422':
 *         description: Carrinho vazio ou cupom inválido.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get("/", autenticar, listarPedidos);
router.post("/", autenticar, iniciarCheckout);

/**
 * @openapi
 * /api/v1/pedidos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um pedido do usuário autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso.
 *       403:
 *         description: O pedido não pertence ao usuário autenticado.
 *       404:
 *         description: Pedido não encontrado.
 *       422:
 *         description: Pedido já concluído ou cancelado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch("/:id/cancelar", autenticar, cancelarPedido);

/**
 * @openapi
 * /api/v1/pedidos/{id}/cupom:
 *   patch:
 *     summary: Aplica um cupom de desconto a um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: BEMVINDO10
 *     responses:
 *       200:
 *         description: Cupom aplicado com sucesso.
 *       403:
 *         description: O pedido não pertence ao usuário autenticado.
 *       404:
 *         description: Pedido ou cupom não encontrado.
 *       422:
 *         description: Cupom já utilizado ou pedido inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch("/:id/cupom", autenticar, aplicarCupom);

router.post("/:id/pagamento/pix", autenticar, processarPagamentoPix);
router.post("/:id/pagamento/boleto", autenticar, processarPagamentoBoleto);
router.post("/:id/pagamento/cartao", autenticar, processarPagamentoCartao);

export default router;