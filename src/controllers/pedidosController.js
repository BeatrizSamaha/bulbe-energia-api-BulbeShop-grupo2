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
