import { Router } from 'express';
import { verPerfil, editarPerfil, consultarPontos } from '../controllers/usuariosController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioPerfil:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         nome:
 *           type: string
 *           example: "Pedro Paulucci"
 *         email:
 *           type: string
 *           example: "pedro.paulucci@bulbeshop.com.br"
 *         papel:
 *           type: string
 *           example: "cliente"
 *         pontos:
 *           type: integer
 *           example: 210
 *     UsuarioEditar:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: "Pedro Paulucci"
 *         senha:
 *           type: string
 *           example: "novaSenha123"
 *
 * /api/v1/usuarios/perfil:
 *   get:
 *     summary: Visualizar perfil do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioPerfil'
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/perfil', autenticar, verPerfil);

/**
 * @swagger
 * /api/v1/usuarios/perfil:
 *   put:
 *     summary: Editar perfil do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioEditar'
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *       400:
 *         description: Nenhum campo informado para atualizar.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 */
router.put('/perfil', autenticar, editarPerfil);

/**
 * @swagger
 * /api/v1/usuarios/pontos:
 *   get:
 *     summary: Consultar pontos Bulbe do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pontos retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: string
 *                   example: "Pedro Paulucci"
 *                 pontos:
 *                   type: integer
 *                   example: 10000
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/pontos', autenticar, consultarPontos);

export default router;
