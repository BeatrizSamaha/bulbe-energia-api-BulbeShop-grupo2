import { pedidos } from "../data/pedidos.js";

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

export const cancelarPedido = (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const pedido = pedidos.find((p) => p.id === Number(id));

        //Pedido não existe
        if (!pedido) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado.",
            });
        }

        //Pedido não é do usuário
        if (pedido.usuarioId !== usuarioId) {
            return res.status(403).json({
                mensagem: "Você não tem permissão para cancelar este pedido.",
            });
        }

        //Pedido já está concluido ou cancelado
        if (pedido.status === "concluido" || pedido.status === "cancelado") {
            return res.status(422).json({
                mensagem: `Não é possível cancelar um pedido que já está ${pedido.status}.`,
            });
        }

        pedido.status = "cancelado";
        pedido.canceladoEm = new Date().toISOString();

        return res.status(200).json({
            mensagem: "Pedido cancelado com sucesso",
            pedido,
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao cancelar pedido.",
        });
    }
};
