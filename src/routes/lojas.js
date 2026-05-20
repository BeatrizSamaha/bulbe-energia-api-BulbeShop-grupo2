import { Router } from 'express';
import {
    listarLojas, buscarLojaPorId, listarProdutosPorLoja,
    criarLoja, atualizarLoja, deletarLoja,
} from '../controllers/lojasController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { autorizar }  from '../middlewares/autorizar.js';
import { validar }    from '../middlewares/validar.js';
import { schemaCriarLoja } from '../validators/schemas.js';

const router = Router();

router.get('/',              listarLojas);
router.get('/:id',          buscarLojaPorId);
router.get('/:id/produtos', listarProdutosPorLoja);

router.post('/',
    autenticar, autorizar('admin'),
    validar(schemaCriarLoja), criarLoja);
router.put('/:id',    autenticar, autorizar('admin'), atualizarLoja);
router.delete('/:id', autenticar, autorizar('admin'), deletarLoja);

export default router;
/**
 * @openapi
 * components:
 *   schemas:
 *     Loja:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: 'SolarTech Equipamentos'
 *         endereco:
 *           type: string
 *           example: 'Av. Paulista, 1000 - São Paulo/SP'
 *         telefone:
 *           type: string
 *           example: '(11) 91234-5678'
 *         horario:
 *           type: string
 *           example: 'Seg a Sex: 08h às 18h | Sáb: 08h às 13h'
 *         produtos:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Painéis solares', 'Inversores']
 *         estado:
 *           type: string
 *           example: 'SP'
 *         ativa:
 *           type: boolean
 *           example: true
 *
 * /api/v1/lojas-parceiras:
 *   get:
 *     summary: Lista todas as lojas parceiras
 *     tags: [Lojas Parceiras]
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de lojas parceiras.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loja'
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/lojas-parceiras/{id}:
 *   get:
 *     summary: Busca uma loja parceira pelo ID
 *     tags: [Lojas Parceiras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a loja parceira encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loja'
 *       '404':
 *         description: Loja parceira não encontrada.
 *       '500':
 *         description: Erro interno do servidor.
 */