import { Router } from 'express';
import {
    avaliarProduto,
    listarAvaliacoesDoProduto,
} from '../controllers/avaliacoesController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { validar }    from '../middlewares/validar.js';
import { schemaAvaliacao } from '../validators/schemas.js';

const router = Router({ mergeParams: true });

router.get('/',  listarAvaliacoesDoProduto);
router.post('/', autenticar, validar(schemaAvaliacao), avaliarProduto);

export default router;

// Documentação swagger
/**
 * @openapi
 * components:
 *   schemas:
 *     Avaliacao:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nota:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comentario:
 *           type: string
 *           example: Produto excelente!
 *         data:
 *           type: string
 *           format: date-time
 *         autor:
 *           type: string
 *           example: Beatriz Samaha
 *     AvaliacaoCriar:
 *       type: object
 *       required: [nota]
 *       properties:
 *         nota:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comentario:
 *           type: string
 *           minLength: 3
 *           example: Produto excelente, recomendo!
 *
 * /api/v1/produtos/{produtoId}/avaliacoes:
 *   get:
 *     summary: Lista as avaliações de um produto
 *     tags: [Avaliações]
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       '200':
 *         description: Avaliações retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produto:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Lâmpada LED 9W
 *                     media:
 *                       type: number
 *                       example: 4.5
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 avaliacoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Avaliacao'
 *       '404':
 *         description: Produto não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *   post:
 *     summary: Avalia um produto (somente quem comprou)
 *     description: Cria ou atualiza a avaliação do usuário autenticado para o produto. Só é permitido avaliar produtos com pedido concluído.
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a avaliar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvaliacaoCriar'
 *     responses:
 *       '201':
 *         description: Avaliação criada com sucesso.
 *       '200':
 *         description: Avaliação atualizada com sucesso.
 *       '400':
 *         description: Dados inválidos (nota fora do range ou ausente).
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Usuário não comprou este produto.
 *       '404':
 *         description: Produto não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
