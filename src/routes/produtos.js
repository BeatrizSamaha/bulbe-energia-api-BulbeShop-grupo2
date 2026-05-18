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
 *           example: 'Economia de energia'
 *         stock:
 *           type: integer
 *           example: 150
 *         image:
 *           type: string
 *           example: 'lampada-led-9w.jpg'
 *
 * /api/v1/produtos:
 *   get:
 *     summary: Lista produtos com paginação e filtros
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Quantidade de itens por página (máx. 100)
 *         example: 20
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Filtrar produtos por termo de busca no título
 *         example: 'Lâmpada'
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar produtos por categoria
 *         example: 'Economia de energia'
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista paginada de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna o produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       '404':
 *         description: Produto não encontrado.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */

// Rota pública [IMP-30]
router.get('/', autenticar, listarProdutos);
// Rota protegida
router.get('/:id', autenticar, buscarProdutoPorId);

export default router;