import { Router } from 'express';
import { favoritarProduto, desfavoritarProduto, listarFavoritos } from '../controllers/favoritosController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ItemFavorito:
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
 *         image:
 *           type: string
 *           example: 'lampada-led-9w.jpg'
 *
 * /api/v1/favoritos/{produtoId}:
 *   post:
 *     summary: Favorita um produto
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser favoritado
 *         example: 1
 *     responses:
 *       '201':
 *         description: Produto favoritado. Retorna a lista de favoritos atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemFavorito'
 *       '404':
 *         description: Produto não encontrado.
 *       '422':
 *         description: Produto já está nos favoritos.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 *   delete:
 *     summary: Desfavorita um produto
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser desfavoritado
 *         example: 1
 *     responses:
 *       '204':
 *         description: Produto removido dos favoritos com sucesso.
 *       '404':
 *         description: Produto não encontrado nos favoritos.
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/favoritos:
 *   get:
 *     summary: Lista todos os produtos favoritos do usuário
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de favoritos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemFavorito'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 *
 */
router.post('/:produtoId', autenticar, favoritarProduto);
router.delete('/:produtoId', autenticar, desfavoritarProduto);
router.get('/', autenticar, listarFavoritos);

export default router;