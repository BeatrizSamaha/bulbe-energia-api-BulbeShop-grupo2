import { Router } from "express";
import { buscarPedidoPorId } from "../controllers/pedidosController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

/**
 * @swagger
 * /api/v1/pedidos/{id}:
 * get:
 * summary: Buscar pedido por ID
 * description: Retorna os detalhes completos de um pedido específico. Requer autenticação JWT e valida se o pedido pertence ao usuário logado.
 * tags: [Pedidos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID numérico do pedido.
 * responses:
 * 200:
 * description: Detalhes do pedido retornados com sucesso.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: integer
 * example: 1
 * usuarioId:
 * type: integer
 * example: 101
 * data:
 * type: string
 * format: date-time
 * example: "2026-05-09T14:30:00Z"
 * status:
 * type: string
 * enum: [ativo, concluido, cancelado]
 * example: "ativo"
 * metodoPagamento:
 * type: string
 * example: "cartao_credito"
 * itens:
 * type: array
 * items:
 * type: object
 * properties:
 * produtoId: { type: integer, example: 50 }
 * nome: { type: string, example: "Teclado Gamer" }
 * quantidade: { type: integer, example: 1 }
 * precoUnitario: { type: number, example: 250.00 }
 * subtotal:
 * type: number
 * example: 250.00
 * desconto:
 * type: number
 * example: 0.00
 * total:
 * type: number
 * example: 250.00
 * cupom:
 * type: string
 * nullable: true
 * example: null
 * canceladoEm:
 * type: string
 * format: date-time
 * nullable: true
 * example: null
 * 403:
 * description: Acesso negado. O pedido não pertence ao usuário autenticado.
 * 404:
 * description: Pedido não encontrado.
 */
router.get('/:id', autenticar,buscarPedidoPorId);

export default router;