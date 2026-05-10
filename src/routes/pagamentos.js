import { Router } from 'express';
import { processarPagamentoPix, processarPagamentoBoleto } from '../controllers/pagamentosController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

/**
 * @swagger
 * /api/v1/pagamentos/pix:
 *   post:
 *     summary: Processar pagamento via PIX
 *     description: Cria um novo pedido com pagamento via PIX. Retorna os dados do pedido e a chave PIX para pagamento.
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itens
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *               cupom:
 *                 type: string
 *                 example: "BEMVINDO10"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedido:
 *                   type: object
 *                 pagamento:
 *                   type: object
 *                   properties:
 *                     metodo:
 *                       type: string
 *                       example: "pix"
 *                     chavePix:
 *                       type: string
 *                       example: "bulbeshop@pix.com.br"
 *                     qrCode:
 *                       type: string
 *                       example: "00020126580014br.gov.bcb.pix0136bulbeshop@pix.com.br"
 *                     expiracao:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Itens não informados ou cupom inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 */
router.post('/pix', autenticar, processarPagamentoPix);

/**
 * @swagger
 * /api/v1/pagamentos/boleto:
 *   post:
 *     summary: Processar pagamento via boleto
 *     description: Cria um novo pedido com pagamento via boleto. Retorna os dados do pedido e o código de barras para pagamento.
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itens
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                       example: 1
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *               cupom:
 *                 type: string
 *                 example: "BEMVINDO10"
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedido:
 *                   type: object
 *                 pagamento:
 *                   type: object
 *                   properties:
 *                     metodo:
 *                       type: string
 *                       example: "boleto"
 *                     codigoBarras:
 *                       type: string
 *                       example: "34191.79001 01043.510047 91020.150008 1 00000003780"
 *                     linhaDigitavel:
 *                       type: string
 *                       example: "34191790010104351004791020150008100000003780"
 *                     vencimento:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Itens não informados ou cupom inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 */
router.post('/boleto', autenticar, processarPagamentoBoleto);

export default router;
