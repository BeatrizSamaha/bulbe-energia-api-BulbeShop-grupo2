import { pedidos } from "../data/pedidos.js";
import { carrinho } from '../data/carrinho.js';
import { cupons } from "../data/cupons.js";

export const buscarPedidoPorId = (req, res) => {
    const { id } = req.params;
    const usuarioLogadoId = req.usuario?.sub;
    const pedido = pedidos.find((p) => p.id === Number(id));

    if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    if (pedido.usuarioId !== Number(usuarioLogadoId)) {
        return res.status(403).json({
            mensagem: "Acesso negado: este pedido não pertence a você",
        });
    }

    return res.status(200).json(pedido);
};

export const listarPedidos = (req, res) => {
    try {
        const usuarioId = req.usuario.sub;
        const meusPedidos = pedidos.filter((p) => p.usuarioId === usuarioId);
        const pedidosOrdenados = meusPedidos.sort(
            (a, b) => new Date(b.data) - new Date(a.data),
        );
        res.status(200).json(pedidosOrdenados);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar histórico de pedidos." });
    }
};

export const iniciarCheckout = (req, res) => {
    try {
        const usuarioId = req.usuario.sub;
        const { cupom: codigoCupom } = req.body;

        if (carrinho.length === 0) {
            return res.status(422).json({ erro: 'O carrinho está vazio.' });
        }

        const subtotal = carrinho.reduce((acc, item) => {
            return acc + item.price * item.quantidade;
        }, 0);

        let desconto = 0;
        let cupomAplicado = null;

        if (codigoCupom) {
            const cupomEncontrado = cupons.find(
                (c) => c.codigo === codigoCupom && c.ativo
            );

            if (!cupomEncontrado) {
                return res.status(422).json({ erro: 'Cupom inválido ou expirado.' });
            }

            desconto = cupomEncontrado.tipo === '%'
                ? subtotal * (cupomEncontrado.desconto / 100)
                : cupomEncontrado.desconto;
            cupomAplicado = codigoCupom;
        }

        const total = Math.max(0, subtotal - desconto);

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

export const cancelarPedido = (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.sub;
        const pedido = pedidos.find((p) => p.id === Number(id));

        if (!pedido) {
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        }

        if (pedido.usuarioId !== usuarioId) {
            return res.status(403).json({
                mensagem: "Você não tem permissão para cancelar este pedido.",
            });
        }

        if (pedido.status === "concluido" || pedido.status === "cancelado") {
            return res.status(422).json({
                mensagem: `Não é possível cancelar um pedido que já está ${pedido.status}.`,
            });
        }

        pedido.status = "cancelado";
        pedido.canceladoEm = new Date().toISOString();

        return res.status(200).json({ mensagem: "Pedido cancelado com sucesso", pedido });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao cancelar pedido." });
    }
};

export const aplicarCupom = (req, res) => {
    try {
        const { id } = req.params;
        const { codigo } = req.body;
        const usuarioId = req.usuario.sub;

        const pedido = pedidos.find((p) => p.id === Number(id));

        if (!pedido) {
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        }

        if (pedido.usuarioId !== usuarioId) {
            return res.status(403).json({
                mensagem: "Você não tem permissão para alterar esse pedido.",
            });
        }

        if (pedido.status === "concluido" || pedido.status === "cancelado") {
            return res.status(422).json({
                mensagem: "Não é possível aplicar cupom neste pedido.",
            });
        }

        const cupom = cupons.find((c) => c.codigo === codigo && c.ativo);

        if (!cupom) {
            return res.status(404).json({ mensagem: "Cupom não encontrado ou inativo." });
        }

        const cupomJaUsado = pedidos.some(
            (p) => p.usuarioId === usuarioId && p.cupom === cupom.codigo,
        );

        if (cupomJaUsado) {
            return res.status(422).json({ mensagem: "Este cupom já foi utilizado." });
        }

        const desconto = cupom.tipo === '%'
            ? (pedido.subtotal * cupom.desconto) / 100
            : cupom.desconto;
        pedido.cupom = cupom.codigo;
        pedido.desconto = Number(desconto.toFixed(2));
        pedido.total = Number(Math.max(pedido.subtotal - desconto, 0).toFixed(2));

        return res.status(200).json({ mensagem: "Cupom aplicado com sucesso.", pedido });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao aplicar o cupom." });
    }
};