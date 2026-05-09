import { Router } from 'express';
import { listarProdutos, buscarProdutoPorId } from '../controllers/produtosController.js';
import { autenticar } from '../middlewares/autenticar.js';

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
 *         title:
 *           type: string
 *           example: 'Lâmpada LED 9W'
 *         description:
 *           type: string
 *           example: 'Lâmpada LED de alta eficiência energética, luz branca neutra.'
 *         price:
 *           type: number
 *           example: 18.90
 *         category:
 *           type: string
 *           example: 'Iluminação'
 *         stock:
 *           type: integer
 *           example: 150
 *         image:
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
 *           description: Filtrar produtos por termo de busca no título
 *           example: lampada
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
router.get('/:id', autenticar, buscarProdutoPorId);
 
export default router;