import { Router } from 'express';
import {
    listarDisponiveis, buscarCupomPorCodigo,
    criarCupom, atualizarCupom, deletarCupom,
} from '../controllers/cuponsController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { autorizar }  from '../middlewares/autorizar.js';
import { validar }    from '../middlewares/validar.js';
import { schemaCriarCupom } from '../validators/schemas.js';

const router = Router();

router.get('/',        listarDisponiveis);
router.get('/:codigo', buscarCupomPorCodigo);

router.post('/',
    autenticar, autorizar('admin'),
    validar(schemaCriarCupom), criarCupom);
router.put('/:id',  autenticar, autorizar('admin'), atualizarCupom);
router.delete('/:id', autenticar, autorizar('admin'), deletarCupom);

export default router;

/**
 * @openapi
 * components:
 *   schemas:
 *     Cupom:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         codigo:
 *           type: string
 *           example: 'BEMVINDO10'
 *         desconto:
 *           type: number
 *           example: 10.00
 *         tipo:
 *           type: string
 *           example: '%'
 *         validade:
 *           type: string
 *           example: '2025-12-31'
 *         ativo:
 *           type: boolean
 *           example: true
 *
 * /api/v1/cupons:
 *   get:
 *     summary: Lista todos os cupons ativos
 *     tags: [Cupons]
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de cupons disponíveis.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupom'
 *       '500':
 *         description: Erro interno do servidor.
 *   post:
 *     summary: Cria um novo cupom de desconto (admin)
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo, desconto, tipo]
 *             properties:
 *               codigo:
 *                 type: string
 *                 minLength: 3
 *                 example: VERAO25
 *               desconto:
 *                 type: number
 *                 example: 25
 *               tipo:
 *                 type: string
 *                 enum: ['%', 'R$']
 *                 example: '%'
 *               validade:
 *                 type: string
 *                 format: date
 *                 example: '2026-12-31'
 *               ativo:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       '201':
 *         description: Cupom criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupom'
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '409':
 *         description: Cupom já cadastrado.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/cupons/{codigo}:
 *   get:
 *     summary: Busca um cupom pelo código
 *     tags: [Cupons]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: 'BEMVINDO10'
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna o cupom encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupom'
 *       '404':
 *         description: Cupom não encontrado.
 *       '410':
 *         description: Cupom expirado.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/cupons/{id}:
 *   put:
 *     summary: Atualiza um cupom existente (admin)
 *     tags: [Cupons]
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
 *               codigo:
 *                 type: string
 *               desconto:
 *                 type: number
 *               tipo:
 *                 type: string
 *                 enum: ['%', 'R$']
 *               validade:
 *                 type: string
 *                 format: date
 *               ativo:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Cupom atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupom'
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Cupom não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *   delete:
 *     summary: Remove um cupom (admin)
 *     tags: [Cupons]
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
 *         description: Cupom removido com sucesso.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Cupom não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
