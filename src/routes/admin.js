import { Router } from 'express';
import {
    dashboardAdmin, listarUsuarios,
    buscarUsuarioPorId, alterarPapelUsuario, deletarUsuario,
    listarTodosPedidos,
} from '../controllers/adminController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { autorizar }  from '../middlewares/autorizar.js';

const router = Router();

// Todas as rotas exigem autenticação + papel admin
router.use(autenticar, autorizar('admin'));

router.get('/dashboard',            dashboardAdmin);
router.get('/pedidos',              listarTodosPedidos);
router.get('/usuarios',             listarUsuarios);
router.get('/usuarios/:id',         buscarUsuarioPorId);
router.patch('/usuarios/:id/papel', alterarPapelUsuario);
router.delete('/usuarios/:id',      deletarUsuario);

export default router;

/**
 * @openapi
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Retorna métricas gerais do sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Resumo gerado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumo:
 *                   type: object
 *                   properties:
 *                     totalUsuarios:
 *                       type: integer
 *                       example: 6
 *                     totalProdutos:
 *                       type: integer
 *                       example: 5
 *                     totalPedidos:
 *                       type: integer
 *                       example: 7
 *                     pedidosAtivos:
 *                       type: integer
 *                       example: 2
 *                     receitaTotal:
 *                       type: number
 *                       example: 739.50
 *                     produtosSemEstoque:
 *                       type: integer
 *                       example: 0
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/admin/pedidos:
 *   get:
 *     summary: Lista todos os pedidos do sistema (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, concluido, cancelado]
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página (máx. 100)
 *     responses:
 *       '200':
 *         description: Lista de pedidos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *                 total:
 *                   type: integer
 *                   example: 7
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/admin/usuarios:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Filtrar por nome ou e-mail
 *         example: beatriz
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       '200':
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/admin/usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Admin]
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
 *       '200':
 *         description: Usuário encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado. Requer papel admin.
 *       '404':
 *         description: Usuário não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *   delete:
 *     summary: Remove um usuário do sistema
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       '204':
 *         description: Usuário removido com sucesso.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado ou tentativa de auto-exclusão.
 *       '404':
 *         description: Usuário não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * /api/v1/admin/usuarios/{id}/papel:
 *   patch:
 *     summary: Altera o papel (role) de um usuário
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [papel]
 *             properties:
 *               papel:
 *                 type: string
 *                 enum: [admin, cliente]
 *                 example: admin
 *     responses:
 *       '200':
 *         description: Papel atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Papel atualizado.
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       '400':
 *         description: Papel inválido.
 *       '401':
 *         description: Token ausente ou inválido.
 *       '403':
 *         description: Acesso negado ou tentativa de auto-rebaixamento.
 *       '404':
 *         description: Usuário não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 *
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Beatriz Samaha
 *         email:
 *           type: string
 *           example: beatriz.samaha@bulbeshop.com.br
 *         papel:
 *           type: string
 *           enum: [admin, cliente]
 *           example: admin
 *         pontos:
 *           type: integer
 *           example: 10
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           example: 1
 *         data:
 *           type: string
 *           format: date-time
 *           example: '2026-05-01T10:00:00Z'
 *         status:
 *           type: string
 *           enum: [ativo, concluido, cancelado]
 *           example: concluido
 *         metodoPagamento:
 *           type: string
 *           example: pix
 *         subtotal:
 *           type: number
 *           example: 37.80
 *         desconto:
 *           type: number
 *           example: 0
 *         total:
 *           type: number
 *           example: 37.80
 *         cupom:
 *           type: string
 *           nullable: true
 *           example: null
 */
