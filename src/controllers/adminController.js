import db from '../db/conexao.js';

export const dashboardAdmin = (req, res) => {
try {
    const totalUsuarios   = db.prepare("SELECT COUNT(*) AS c FROM usuarios").get().c;
    const totalProdutos   = db.prepare("SELECT COUNT(*) AS c FROM produtos").get().c;
    const totalPedidos    = db.prepare("SELECT COUNT(*) AS c FROM pedidos").get().c;
    const pedidosAtivos   = db.prepare(
    "SELECT COUNT(*) AS c FROM pedidos WHERE status='ativo'"
    ).get().c;
    const receitaTotal    = db.prepare(
    "SELECT SUM(total) AS s FROM pedidos WHERE status='concluido'"
    ).get().s || 0;
    const semEstoque      = db.prepare(
    "SELECT COUNT(*) AS c FROM produtos WHERE stock=0"
    ).get().c;

    return res.status(200).json({
    resumo: {
        totalUsuarios, totalProdutos, totalPedidos,
        pedidosAtivos,
        receitaTotal: parseFloat(receitaTotal.toFixed(2)),
        produtosSemEstoque: semEstoque,
    },
    });
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao gerar dashboard.' });
}
};

export const listarUsuarios = (req, res) => {
try {
    const { page = 1, limit = 20, busca } = req.query;
    let query  = 'SELECT id, nome, email, papel, pontos FROM usuarios WHERE 1=1';
    const params = [];

    if (busca) {
    query += ' AND (LOWER(nome) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?))';
    params.push(`%${busca}%`, `%${busca}%`);
    }

    const todos    = db.prepare(query).all(...params);
    const total    = todos.length;
    const pg       = Math.max(1, parseInt(page));
    const lim      = Math.min(100, Math.max(1, parseInt(limit)));
    const inicio   = (pg - 1) * lim;

    return res.status(200).json({
    data: todos.slice(inicio, inicio + lim),
    total, page: pg, limit: lim,
    totalPages: Math.ceil(total / lim),
    });
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao listar usuários.' });
}
};

export const buscarUsuarioPorId = (req, res) => {
try {
    const u = db.prepare(
    'SELECT id, nome, email, papel, pontos FROM usuarios WHERE id = ?'
    ).get(Number(req.params.id));

    if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.status(200).json(u);
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
}
};

export const alterarPapelUsuario = (req, res) => {
try {
    const id    = Number(req.params.id);
    const { papel } = req.body;

    if (!['admin', 'cliente'].includes(papel))
    return res.status(400).json({ erro: 'Papel deve ser "admin" ou "cliente".' });

    if (!db.prepare('SELECT id FROM usuarios WHERE id = ?').get(id))
    return res.status(404).json({ erro: 'Usuário não encontrado.' });

    if (id === req.usuario.sub && papel === 'cliente')
    return res.status(403).json({
        erro: 'Você não pode rebaixar sua própria conta.',
    });

    db.prepare('UPDATE usuarios SET papel = ? WHERE id = ?').run(papel, id);
    const u = db.prepare(
    'SELECT id, nome, email, papel, pontos FROM usuarios WHERE id = ?'
    ).get(id);
    return res.status(200).json({ mensagem: 'Papel atualizado.', usuario: u });
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao alterar papel.' });
}
};

export const deletarUsuario = (req, res) => {
try {
    const id = Number(req.params.id);
    if (id === req.usuario.sub)
    return res.status(403).json({
        erro: 'Você não pode deletar sua própria conta.',
    });

    if (!db.prepare('SELECT id FROM usuarios WHERE id = ?').get(id))
    return res.status(404).json({ erro: 'Usuário não encontrado.' });

    db.prepare('DELETE FROM carrinho_itens WHERE usuario_id = ?').run(id);
    db.prepare('DELETE FROM favoritos     WHERE usuario_id = ?').run(id);
    db.prepare('DELETE FROM avaliacoes    WHERE usuario_id = ?').run(id);
    db.prepare('DELETE FROM usuarios      WHERE id = ?').run(id);

    return res.status(204).send();
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao deletar usuário.' });
}
};