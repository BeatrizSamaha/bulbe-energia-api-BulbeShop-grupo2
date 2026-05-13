import { pedidos } from '../data/pedidos.js';

const validarPedido = (id, usuarioId, res) => {
    const pedido = pedidos.find((p) => p.id === Number(id));

    if (!pedido) {
        res.status(404).json({ mensagem: 'Pedido não encontrado.' });
        return null;
    }

    if (pedido.usuarioId !== usuarioId) {
        res.status(403).json({ mensagem: 'Acesso negado.' });
        return null;
    }

    if (pedido.metodoPagamento !== null) {
        res.status(422).json({ mensagem: 'Este pedido já foi pago.' });
        return null;
    }

    return pedido;
};

export const processarPagamentoPix = (req, res) => {
    const usuarioId = req.usuario.sub;
    const pedido = validarPedido(req.params.id, usuarioId, res);
    if (!pedido) return;

    pedido.metodoPagamento = 'pix';
    pedido.status = 'concluido';

    return res.status(200).json({
        pedido,
        pagamento: {
            metodo: 'pix',
            chavePix: 'bulbeshop@pix.com.br',
            qrCode: '00020126580014br.gov.bcb.pix0136bulbeshop@pix.com.br',
            expiracao: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
    });
};

export const processarPagamentoBoleto = (req, res) => {
    const usuarioId = req.usuario.sub;
    const pedido = validarPedido(req.params.id, usuarioId, res);
    if (!pedido) return;

    pedido.metodoPagamento = 'boleto';
    pedido.status = 'concluido';

    return res.status(200).json({
        pedido,
        pagamento: {
            metodo: 'boleto',
            codigoBarras: '34191.79001 01043.510047 91020.150008 1 00000003780',
            linhaDigitavel: '34191790010104351004791020150008100000003780',
            vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
    });
};

export const processarPagamentoCartao = (req, res) => {
    const usuarioId = req.usuario.sub;
    const { cartao } = req.body;

    if (!cartao || !cartao.tipo) {
        return res.status(400).json({ mensagem: 'Informe os dados do cartão (tipo: debito ou credito).' });
    }

    if (!['debito', 'credito'].includes(cartao.tipo)) {
        return res.status(400).json({ mensagem: 'Tipo de cartão inválido. Use "debito" ou "credito".' });
    }

    const pedido = validarPedido(req.params.id, usuarioId, res);
    if (!pedido) return;

    const parcelas = cartao.tipo === 'credito' ? (cartao.parcelas || 1) : 1;
    const metodoPagamento = cartao.tipo === 'credito' ? 'cartao_credito' : 'cartao_debito';

    pedido.metodoPagamento = metodoPagamento;
    pedido.status = 'concluido';

    return res.status(200).json({
        pedido,
        pagamento: {
            metodo: metodoPagamento,
            status: 'aprovado',
            bandeira: 'Visa',
            ultimos4Digitos: '1234',
            parcelas,
            valorParcela: parseFloat((pedido.total / parcelas).toFixed(2)),
            autorizacao: `AUTH-${Date.now()}`,
        },
    });
};
