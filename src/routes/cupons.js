import { Router } from 'express';
import { listarDisponiveis, buscarCupomPorCodigo } from '../controllers/cuponsController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de cupons disponíveis.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupom'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/cupons/{codigo}:
 *   get:
 *     summary: Busca um cupom pelo código
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
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
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/', autenticar, listarDisponiveis);
router.get('/:codigo', autenticar, buscarCupomPorCodigo);

export default router;