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

router.get('/',    listarLojas);
router.get('/:id', buscarLojaPorId);
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
 *   post:
 *     summary: Cria uma nova loja parceira (admin)
 *     tags: [Lojas Parceiras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: EnerSol Nordeste
 *               endereco:
 *                 type: string
 *                 example: Rua do Sol, 100 - Recife/PE
 *               telefone:
 *                 type: string
 *                 example: (81) 99999-0000
 *               horario:
 *                 type: string
 *                 example: Seg a Sex 08h às 17h
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Painéis solares', 'Baterias']
 *               estado:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: PE
 *               ativa:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       '201':
 *         description: Loja criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loja'
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
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
 *   put:
 *     summary: Atualiza uma loja parceira (admin)
 *     tags: [Lojas Parceiras]
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
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: string
 *               telefone:
 *                 type: string
 *               horario:
 *                 type: string
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: string
 *               estado:
 *                 type: string
 *               ativa:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Loja atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loja'
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Loja não encontrada.
 *       '500':
 *         description: Erro interno do servidor.
 *   delete:
 *     summary: Remove uma loja parceira (admin)
 *     tags: [Lojas Parceiras]
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
 *         description: Loja removida com sucesso.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Loja não encontrada.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/lojas-parceiras/{id}/produtos:
 *   get:
 *     summary: Lista os produtos vinculados a uma loja parceira
 *     tags: [Lojas Parceiras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da loja parceira
 *         example: 1
 *     responses:
 *       '200':
 *         description: Lista de produtos da loja retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       '404':
 *         description: Loja parceira não encontrada ou inativa.
 *       '500':
 *         description: Erro interno do servidor.
 */