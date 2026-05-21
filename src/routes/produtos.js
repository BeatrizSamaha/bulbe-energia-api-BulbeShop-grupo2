import { Router } from 'express';
import {
    listarProdutos, buscarProdutoPorId,
    criarProduto, atualizarProduto,
    deletarProduto, atualizarEstoque,
} from '../controllers/produtosController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { autorizar }  from '../middlewares/autorizar.js';
import { validar }    from '../middlewares/validar.js';
import {
    schemaCriarProduto, schemaEditarProduto
} from '../validators/schemas.js';
import avaliacoesRouter from './avaliacoes.js';

const router = Router();

// Rotas públicas
router.get('/',    listarProdutos);
router.get('/:id', buscarProdutoPorId);

// Avaliações aninhadas em /:produtoId/avaliacoes
router.use('/:produtoId/avaliacoes', avaliacoesRouter);

// Rotas admin
router.post('/',
    autenticar, autorizar('admin'),
    validar(schemaCriarProduto), criarProduto);
router.put('/:id',
    autenticar, autorizar('admin'),
    validar(schemaEditarProduto), atualizarProduto);
router.patch('/:id/estoque',
    autenticar, autorizar('admin'), atualizarEstoque);
router.delete('/:id',
    autenticar, autorizar('admin'), deletarProduto);

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
 *       - in: query
 *         name: destaque
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas produtos em destaque
 *         example: true
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
 *   post:
 *     summary: Cria um novo produto (admin)
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Painel Solar 400W
 *               description:
 *                 type: string
 *                 example: Painel fotovoltaico de alta eficiência.
 *               price:
 *                 type: number
 *                 example: 1299.90
 *               category:
 *                 type: string
 *                 example: Economia de energia
 *               stock:
 *                 type: integer
 *                 example: 20
 *               image:
 *                 type: string
 *                 example: painel-solar-400w.jpg
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               variations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Monocristalino', 'Policristalino']
 *               destaque:
 *                 type: boolean
 *                 example: true
 *               loja_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
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
 *       '500':
 *         description: Erro interno do servidor.
 *   put:
 *     summary: Atualiza um produto existente (admin)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *               variations:
 *                 type: array
 *                 items:
 *                   type: string
 *               destaque:
 *                 type: boolean
 *               loja_id:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Produto não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *   delete:
 *     summary: Remove um produto (admin)
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
 *       '204':
 *         description: Produto removido com sucesso.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Produto não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/produtos/{id}/estoque:
 *   patch:
 *     summary: Atualiza o estoque de um produto (admin)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantidade]
 *             properties:
 *               quantidade:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *     responses:
 *       '200':
 *         description: Estoque atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       '400':
 *         description: Quantidade inválida.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Produto não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */

export default router;