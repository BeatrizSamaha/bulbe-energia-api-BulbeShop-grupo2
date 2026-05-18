import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Cadastra um novo usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso. Retorna token JWT.
 *       409:
 *         description: E-mail já cadastrado.
 *       400:
 *         description: Campos obrigatórios ausentes.
 *
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
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: beatriz.samaha@bulbeshop.com.br
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       '200':
 *         description: Login bem-sucedido. Retorna o token JWT.
 *       '401':
 *         description: Credenciais inválidas.
 *       '400':
 *         description: Campos obrigatórios ausentes.
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
 *       '400':
 *         description: Token não fornecido.
 *       '401':
 *         description: Token inválido ou expirado.
 */
router.post('/register', register);
router.post('/login', login);
router.post('/logout', autenticar, logout);

export default router;