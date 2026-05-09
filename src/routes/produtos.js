import { Router } from 'express';
import { listarProdutos } from '../controllers/produtosController.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: 'Lâmpada LED 9W'
 *         descricao:
 *           type: string
 *           example: 'Lâmpada LED de alta eficiência energética, luz branca neutra.'
 *         preco:
 *           type: number
 *           example: 18.90
 *         categoria:
 *           type: string
 *           example: 'Iluminação'
 *         estoque:
 *           type: integer
 *           example: 150
 *         imagem:
 *           type: string
 *           example: 'lampada-led-9w.jpg'
 *
 * /api/v1/produtos:
 *   get:
 *     summary: Lista todos os produtos da página inicial
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/', listarProdutos);

export default router;