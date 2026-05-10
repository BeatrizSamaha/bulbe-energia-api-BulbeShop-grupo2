import { Router } from "express";
import {
    buscarPedidoPorId,
    listarPedidos,
    cancelarPedido,
    aplicarCupom,
} from "../controllers/pedidosController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @swagger
 * 
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 8
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   example: 'ativo'
 *                 itens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ItemCarrinho'
 *                 subtotal:
 *                   type: number
 *                   example: 37.80
 *                 desconto:
 *                   type: number
 *                   example: 10.00
 *                 total:
 *                   type: number
 *                   example: 27.80
 *                 cupom:
 *                   type: string
 *                   nullable: true
 *                   example: 'BEMVINDO10'
 *       '422':
 *         description: Carrinho vazio ou cupom inválido.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get("/", autenticar, listarPedidos);
router.post("/:id/cupom", autenticar, aplicarCupom);

/**
 * @swagger
 * /api/v1/pedidos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um pedido do usuário autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *           example: 7
 *
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Pedido cancelado com sucesso
 *                 pedido:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     usuarioId:
 *                       type: integer
 *                       example: 1
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-09T15:00:00Z
 *                     status:
 *                       type: string
 *                       example: cancelado
 *                     metodoPagamento:
 *                       type: string
 *                       example: pix
 *                     itens:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           produtoId:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: Lâmpada LED 9W
 *                           quantidade:
 *                             type: integer
 *                             example: 5
 *                           price:
 *                             type: number
 *                             example: 18.90
 *                     subtotal:
 *                       type: number
 *                       example: 94.50
 *                     desconto:
 *                       type: number
 *                       example: 0
 *                     total:
 *                       type: number
 *                       example: 94.50
 *                     cupom:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     canceladoEm:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-10T14:30:00.000Z
 *
 *       403:
 *         description: O pedido não pertence ao usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Você não tem permissão para cancelar este pedido.
 *
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Pedido não encontrado.
 *
 *       422:
 *         description: Pedido já concluído ou cancelado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Não é possível cancelar um pedido que já está concluido.
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Erro ao cancelar pedido.
 */
router.patch("/:id/cancelar", autenticar, cancelarPedido);

/**
 * @swagger
 * /api/v1/pedidos/{id}/cupom:
 *   post:
 *     summary: Aplica um cupom de desconto a um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *           example: 2
 *
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
 *
 *     responses:
 *       200:
 *         description: Cupom aplicado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Cupom aplicado com sucesso.
 *                 pedido:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     usuarioId:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-03T15:30:00Z
 *                     status:
 *                       type: string
 *                       example: ativo
 *                     metodoPagamento:
 *                       type: string
 *                       example: pix
 *                     subtotal:
 *                       type: number
 *                       example: 239.70
 *                     desconto:
 *                       type: number
 *                       example: 23.97
 *                     total:
 *                       type: number
 *                       example: 215.73
 *                     cupom:
 *                       type: string
 *                       example: BEMVINDO10
 *                     canceladoEm:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *
 *       403:
 *         description: O pedido não pertence ao usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Você não tem permissão para alterar esse pedido.
 *
 *       404:
 *         description: Pedido ou cupom não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Cupom não encontrado ou inativo.
 *
 *       422:
 *         description: Cupom já utilizado ou pedido inválido para aplicação de cupom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Este cupom já foi utilizado.
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Erro ao aplicar o cupom.
 */
router.post("/api/v1/pedidos/:id/cupom", autenticar, aplicarCupom);
//ISSO PODERIA SER UM PATCH, MAS NA IMP ESTÁ COMO POST.

export default router;
