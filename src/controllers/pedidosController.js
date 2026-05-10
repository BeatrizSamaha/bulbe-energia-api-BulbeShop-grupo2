import { pedidos } from "../data/pedidos.js";
import { carrinho } from '../data/carrinho.js';
import { cupons } from '../data/cupons.js';

export const buscarPedidoPorId = (req, res) => {
    const { id } = req.params;

    const usuarioLogadoId = req.usuario?.id;

    const pedido = pedidos.find((p) => p.id === Number(id));

    // Validação: EXISTE
    if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    // Validação: Pedido é do Usuário
    if (pedido.usuarioId !== Number(usuarioLogadoId)) {
        return res.status(403).json({
            mensagem: "Acesso negado: este pedido não pertence a você",
        });
    }

    // Sucesso
    return res.status(200).json(pedido);
};

export const listarPedidos = (req, res) => {
    try {
        // req.usuario.id vem do seu middleware 'autenticar'
        const usuarioId = req.usuario.id;

        // Filtramos a base para retornar apenas o que pertence ao usuário logado
        const meusPedidos = pedidos.filter((p) => p.usuarioId === usuarioId);

        //ordena por data
        const pedidosOrdenados = meusPedidos.sort(
            (a, b) => new Date(b.data) - new Date(a.data),
        );

        res.status(200).json(meusPedidos);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar histórico de pedidos.",
        });
    }
};

export const iniciarCheckout = (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { cupom: codigoCupom } = req.body;

        if (carrinho.length === 0) {
            return res.status(422).json({ erro: 'O carrinho está vazio.' });
        }

        const subtotal = carrinho.reduce((acc, item) => {
            return acc + item.price * item.quantidade;
        }, 0);

        // Aplica cupom se informado
        let desconto = 0;
        let cupomAplicado = null;

        if (codigoCupom) {
            const cupomEncontrado = cupons.find(
                (c) => c.codigo === codigoCupom && c.ativo
            );

            if (!cupomEncontrado) {
                return res.status(422).json({ erro: 'Cupom inválido ou expirado.' });
            }

            desconto = cupomEncontrado.valor;
            cupomAplicado = codigoCupom;
        }

        const total = Math.max(0, subtotal - desconto);

        // Cria o pedido
        const novoPedido = {
            id: pedidos.length + 1,
            usuarioId,
            data: new Date().toISOString(),
            status: 'ativo',
            metodoPagamento: null,
            itens: carrinho.map((item) => ({ ...item })),
            subtotal: Number(subtotal.toFixed(2)),
            desconto: Number(desconto.toFixed(2)),
            total: Number(total.toFixed(2)),
            cupom: cupomAplicado,
            canceladoEm: null,
        };

        pedidos.push(novoPedido);

        carrinho.splice(0, carrinho.length);

        return res.status(201).json(novoPedido);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno ao iniciar checkout.' });
    }
};
