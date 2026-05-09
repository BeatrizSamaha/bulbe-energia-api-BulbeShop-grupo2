import { Router } from 'express';
import { listarDisponiveis } from '../controllers/cuponsController.js';
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
 *         valor:
 *           type: number
 *           example: 10.50
 *         ativo:
 *           type: boolean
 *           example: true
 * /api/v1/cupons/disponiveis:
 *   get:
 *     summary: Lista todos os cupons disponíveis (ativos)
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de cupons ativos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupom'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 */
// Rota protegida pelo middleware de autenticação
router.get('/disponiveis', autenticar, listarDisponiveis);

export default router;