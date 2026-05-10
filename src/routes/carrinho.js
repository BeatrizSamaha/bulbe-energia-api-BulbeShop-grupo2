import { Router } from 'express';
import { adicionarItem } from '../controllers/carrinhoController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ItemCarrinho:
 *       type: object
 *       properties:
 *         produtoId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: 'Lâmpada LED 9W'
 *         price:
 *           type: number
 *           example: 18.90
 *         img:
 *           type: string
 *           example: 'lampada-led-9w.jpg'
 *         quantidade:
 *           type: integer
 *           example: 2
 *
 * /api/v1/carrinho/itens:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtoId
 *             properties:
 *               produtoId:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 example: 1
 *                 description: Quantidade a adicionar (padrão 1 se não informado)
 *     responses:
 *       '201':
 *         description: Item adicionado. Retorna o carrinho atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCarrinho'
 *       '400':
 *         description: produtoId não informado.
 *       '404':
 *         description: Produto não encontrado.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/itens', autenticar, adicionarItem);

export default router;