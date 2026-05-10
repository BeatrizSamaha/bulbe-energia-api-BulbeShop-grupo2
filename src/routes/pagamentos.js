import { Router } from 'express';
import { processarPagamentoPix } from '../controllers/pagamentosController.js';
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

export default router;
