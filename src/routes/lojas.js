import { Router } from 'express';
import { listarLojas } from '../controllers/lojasController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

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
 *         estado:
 *           type: string
 *           example: 'SP'
 *         ativa:
 *           type: boolean
 *           example: true
 * /api/v1/lojas:
 *   get:
 *     summary: Lista todas as lojas parceiras
 *     tags: [Lojas]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de lojas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loja'
 *       '401':
 *         description: Não autorizado. Token ausente ou inválido.
 */
// Rota protegida
router.get('/', autenticar, listarLojas);

export default router;