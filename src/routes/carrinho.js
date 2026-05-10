import { Router } from 'express';
import { adicionarItem, atualizarQuantidade } from '../controllers/carrinhoController.js';
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
 * /api/v1/carrinho:
 *   get:
 *     summary: Lista os itens do carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna os itens do carrinho.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCarrinho'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 * 
 * /api/v1/carrinho:
 *   get:
 *     summary: Lista os itens do carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna os itens do carrinho.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCarrinho'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
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
 * /api/v1/carrinho/itens/{id}:
 *   patch:
 *     summary: Atualiza a quantidade de um item no carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidade
 *             properties:
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *                 description: Nova quantidade desejada (deve ser >= 1)
 *     responses:
 *       '200':
 *         description: Quantidade atualizada. Retorna o carrinho atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCarrinho'
 *       '404':
 *         description: Item não encontrado no carrinho.
 *       '422':
 *         description: Dados inválidos (quantidade ausente ou menor que 1).
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/itens', autenticar, adicionarItem);
router.patch('/itens/:id', autenticar, atualizarQuantidade);

export default router;