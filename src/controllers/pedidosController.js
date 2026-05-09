import { pedidos } from "../data/pedidos.js";

export const buscarPedidoPorId = (req, res) => {
    const { id } = req.params;

    const usuarioLogadoId = req.usuario?.id;

    const pedido = pedidos.find(p => p.id === Number(id));

    // Validação: EXISTE
    if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    // Validação: Pedido é do Usuário
    if (pedido.usuarioId !== Number(usuarioLogadoId)) {
        return res.status(403).json({ mensagem: "Acesso negado: este pedido não pertence a você" });
    }

    // Sucesso
    return res.status(200).json(pedido);
}