import { Router } from "express";
import { buscarPedidoPorId, listarPedidos, iniciarCheckout } from '../controllers/pedidosController.js';
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @swagger
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-01T10:00:00Z"
 *                 status:
 *                   type: string
 *                   enum:
 *                     - ativo
 *                     - concluido
 *                     - cancelado
 *                   example: "concluido"
 *                 metodoPagamento:
 *                   type: string
 *                   enum:
 *                     - cartao_credito
 *                     - pix
 *                     - boleto
 *                   example: "cartao_credito"
 *                 itens:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       produtoId:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Lâmpada LED 9W"
 *                       quantidade:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 18.90
 *                 subtotal:
 *                   type: number
 *                   format: float
 *                   example: 37.80
 *                 desconto:
 *                   type: number
 *                   format: float
 *                   example: 0.00
 *                 total:
 *                   type: number
 *                   format: float
 *                   example: 37.80
 *                 cupom:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 canceladoEm:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *       403:
 *         description: Acesso negado. O pedido não pertence ao usuário autenticado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.get("/:id", autenticar, buscarPedidoPorId);

/**
 * @swagger
 * /api/v1/pedidos:
 *   get:
 *     summary: Listar histórico de pedidos do usuário
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   data:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-05-01T10:00:00Z"
 *                   status:
 *                     type: string
 *                     enum:
 *                       - ativo
 *                       - concluido
 *                       - cancelado
 *                     example: "concluido"
 *                   total:
 *                     type: number
 *                     format: float
 *                     example: 37.80
 *                   itens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         produtoId:
 *                           type: integer
 *                           example: 1
 *                         title:
 *                           type: string
 *                           example: "Lâmpada LED 9W"
 *                         quantidade:
 *                           type: integer
 *                           example: 2
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 18.90
 *       401:
 *         description: Token ausente ou inválido
 */
router.get("/", autenticar, listarPedidos);

export default router;
