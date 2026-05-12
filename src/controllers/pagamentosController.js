import { produtos } from '../data/produtos.js';
import { cupons } from '../data/cupons.js';
import { pedidos } from '../data/pedidos.js';

export const processarPagamentoPix = (req, res) => {
    const { itens, cupom: codigoCupom } = req.body;

    // PASSO 1: validar que itens existe e não está vazio
    if (!itens || itens.length === 0) {
        return res.status(400).json({ mensagem: 'Informe ao menos um item.' });
    }

    // PASSO 2: para cada item, buscar o produto e validar que existe
    const itensPedido = [];
    for (const item of itens) {
        const produto = produtos.find((p) => p.id === Number(item.produtoId));
        if (!produto) {
            return res.status(404).json({ mensagem: `Produto ${item.produtoId} não encontrado.` });
        }
        itensPedido.push({
            produtoId: produto.id,
            title: produto.title,
            quantidade: item.quantidade,
            price: produto.price,
        });
    }

    // PASSO 3: calcular subtotal somando price * quantidade de cada item
    const subtotal = itensPedido.reduce((acc, item) => acc + item.price * item.quantidade, 0);

    // PASSO 4: aplicar cupom se fornecido
    let desconto = 0;
    let cupomAplicado = null;
    if (codigoCupom) {
        const cupom = cupons.find((c) => c.codigo === codigoCupom && c.ativo);
        if (!cupom) {
            return res.status(400).json({ mensagem: 'Cupom inválido ou expirado.' });
        }
        desconto = cupom.tipo === '%' ? subtotal * (cupom.desconto / 100) : cupom.desconto;
        cupomAplicado = cupom.codigo;
    }

    const total = Math.max(0, subtotal - desconto);

    // PASSO 5: montar o pedido e salvar no array
    const novoPedido = {
        id: pedidos.length + 1,
        usuarioId: req.usuario.sub,
        data: new Date().toISOString(),
        status: 'ativo',
        metodoPagamento: 'pix',
        itens: itensPedido,
        subtotal: parseFloat(subtotal.toFixed(2)),
        desconto: parseFloat(desconto.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        cupom: cupomAplicado,
        canceladoEm: null,
    };
    pedidos.push(novoPedido);

    // PASSO 6: retornar 201 com o pedido + dados PIX mock
    return res.status(201).json({
        pedido: novoPedido,
        pagamento: {
            metodo: 'pix',
            chavePix: 'bulbeshop@pix.com.br',
            qrCode: '00020126580014br.gov.bcb.pix0136bulbeshop@pix.com.br',
            expiracao: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
    });
};

export const processarPagamentoBoleto = (req, res) => {
    //PASSO 1: Deve-se conferir se existe itens
    const {itens, cupom: codigoCupom } = req.body;
    if (!itens || itens.length === 0) {
        return res.status(400).json({mensagem: 'Informe ao menos um item.'});
    }

    //PASSO 2: Para cada item, buscar o produto e validar que ele existe
    const itensPedido = [];
    for (const item of itens) {
        const produto = produtos.find(p => p.id === Number(item.produtoId));
        if (!produto) {
            return res.status(404).json({mensagem: `Produto ${item.produtoId} não encontrado.`});
        }
        itensPedido.push({
            produtoId: produto.id,
            title: produto.title,
            quantidade: Number(item.quantidade),
            price: produto.price,
        });
    }
     // PASSO 3: calcular subtotal somando price * quantidade de cada item
    let subtotal = 0;
    for (const item of itensPedido) {
        subtotal += item.price * item.quantidade;
    }

    // PASSO 4: aplicar cupom se fornecido
    let desconto = 0;
    let cupomAplicado = null;
    if (codigoCupom) {
        const cupom = cupons.find((c) => c.codigo === codigoCupom && c.ativo);
        if (!cupom) {
            return res.status(400).json({ mensagem: 'Cupom inválido ou expirado.' });
        }
        desconto = cupom.tipo === '%' ? subtotal * (cupom.desconto / 100) : cupom.desconto;
        cupomAplicado = cupom.codigo;
    }

    const total = Math.max(0, subtotal - desconto);

    // PASSO 5: montar o pedido e salvar no array
    const novoPedido = {
        id: pedidos.length + 1,
        usuarioId: req.usuario.sub,
        data: new Date().toISOString(),
        status: 'ativo',
        metodoPagamento: 'boleto',
        itens: itensPedido,
        subtotal: parseFloat((subtotal || 0).toFixed(2)),
        desconto: parseFloat((desconto || 0).toFixed(2)),
        total: parseFloat((total || 0).toFixed(2)),
        cupom: cupomAplicado,
        canceladoEm: null,
    };
    pedidos.push(novoPedido);

    // PASSO 6: retornar 201 com o pedido + dados boleto mock
    return res.status(201).json({
        pedido: novoPedido,
        pagamento: {
            metodo: 'boleto',
            codigoBarras: '34191.79001 01043.510047 91020.150008 1 00000003780',
            linhaDigitavel: '34191790010104351004791020150008100000003780',
            vencimento: new Date(Date.now() + 3 * 24* 60 * 60 * 1000).toISOString(),
        },
    });
};

export const processarPagamentoCartao = (req, res) => {
    const { itens, cupom: codigoCupom, cartao } = req.body;

    // PASSO 1: validar itens e dados do cartão
    if (!itens || itens.length === 0) {
        return res.status(400).json({ mensagem: 'Informe ao menos um item.' });
    }
    if (!cartao || !cartao.tipo) {
        return res.status(400).json({ mensagem: 'Informe os dados do cartão (tipo: debito ou credito).' });
    }
    if (!['debito', 'credito'].includes(cartao.tipo)) {
        return res.status(400).json({ mensagem: 'Tipo de cartão inválido. Use "debito" ou "credito".' });
    }

    // PASSO 2: buscar e validar produtos
    const itensPedido = [];
    for (const item of itens) {
        const produto = produtos.find((p) => p.id === Number(item.produtoId));
        if (!produto) {
            return res.status(404).json({ mensagem: `Produto ${item.produtoId} não encontrado.` });
        }
        itensPedido.push({
            produtoId: produto.id,
            title: produto.title,
            quantidade: Number(item.quantidade),
            price: produto.price,
        });
    }

    // PASSO 3: calcular subtotal
    let subtotal = 0;
    for (const item of itensPedido) {
        subtotal += item.price * item.quantidade;
    }

    // PASSO 4: aplicar cupom se fornecido
    let desconto = 0;
    let cupomAplicado = null;
    if (codigoCupom) {
        const cupom = cupons.find((c) => c.codigo === codigoCupom && c.ativo);
        if (!cupom) {
            return res.status(400).json({ mensagem: 'Cupom inválido ou expirado.' });
        }
        desconto = cupom.tipo === '%' ? subtotal * (cupom.desconto / 100) : cupom.desconto;
        cupomAplicado = cupom.codigo;
    }

    const total = Math.max(0, subtotal - desconto);
    const parcelas = cartao.tipo === 'credito' ? (cartao.parcelas || 1) : 1;
    const metodoPagamento = cartao.tipo === 'credito' ? 'cartao_credito' : 'cartao_debito';

    // PASSO 5: montar o pedido e salvar
    const novoPedido = {
        id: pedidos.length + 1,
        usuarioId: req.usuario.sub,
        data: new Date().toISOString(),
        status: 'ativo',
        metodoPagamento,
        itens: itensPedido,
        subtotal: parseFloat(subtotal.toFixed(2)),
        desconto: parseFloat(desconto.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        cupom: cupomAplicado,
        canceladoEm: null,
    };
    pedidos.push(novoPedido);

    // PASSO 6: retornar 201 com dados do cartão mock
    return res.status(201).json({
        pedido: novoPedido,
        pagamento: {
            metodo: metodoPagamento,
            bandeira: 'Visa',
            ultimos4Digitos: '1234',
            parcelas,
            valorParcela: parseFloat((total / parcelas).toFixed(2)),
            autorizacao: `AUTH-${Date.now()}`,
        },
    });
};
