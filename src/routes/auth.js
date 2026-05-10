import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'admin@bulbe.com'
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: '123456'
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna o token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       '401':
 *         description: Credenciais inválidas.
 *       '400':
 *         description: Requisição mal formatada (faltando e-mail ou senha).
 *
 * /api/v1/auth/logout:
 *   post:
 *     summary: Invalida o token JWT do usuário (logout)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Logout realizado com sucesso.'
 *       '400':
 *         description: Token não fornecido.
 *       '401':
 *         description: Token inválido ou expirado.
 */
router.post('/login', login);
router.post('/logout', autenticar, logout);

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Cadastra um novo usuário e retorna um token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string, example: 'João Silva' }
 *               email: { type: string, example: 'joao@email.com' }
 *               senha: { type: string, example: '123456' }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       409:
 *         description: E-mail já cadastrado.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/register', register);

export default router;