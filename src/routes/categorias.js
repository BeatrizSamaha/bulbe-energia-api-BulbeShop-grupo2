import { Router } from 'express';
import { listarCategorias } from '../controllers/categoriasController.js';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: 'Economia de energia'
 *         slug:
 *           type: string
 *           example: 'economia-de-energia'
 *
 * /api/v1/categorias:
 *   get:
 *     summary: Lista todas as categorias de produtos disponíveis
 *     tags: [Categorias]
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/', listarCategorias);

export default router;