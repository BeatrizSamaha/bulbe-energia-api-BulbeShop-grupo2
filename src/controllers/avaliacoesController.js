import db from '../db/conexao.js';

export const avaliarProduto = (req, res) => {
try {
    const usuarioId = req.usuario.sub;
    const produtoId = Number(req.params.produtoId);
    const { nota, comentario } = req.body;

    if (!db.prepare('SELECT id FROM produtos WHERE id = ?').get(produtoId))
    return res.status(404).json({ erro: 'Produto não encontrado.' });

    const comprou = db.prepare(`
        SELECT 1 FROM pedidos
        WHERE usuario_id = ? AND status = 'concluido'
            AND itens LIKE ?
    `).get(usuarioId, `%"produtoId":${produtoId}%`);

    if (!comprou)
    return res.status(403).json({
        erro: 'Você só pode avaliar produtos que já comprou.',
    });

    const jaAvaliou = db.prepare(
    'SELECT id FROM avaliacoes WHERE usuario_id=? AND produto_id=?'
    ).get(usuarioId, produtoId);

    if (jaAvaliou) {
    db.prepare(`
        UPDATE avaliacoes SET nota=?, comentario=?, data=? WHERE id=?
    `).run(nota, comentario ?? null, new Date().toISOString(), jaAvaliou.id);
    } else {
    db.prepare(`
        INSERT INTO avaliacoes (usuario_id, produto_id, nota, comentario, data)
        VALUES (?, ?, ?, ?, ?)
    `).run(usuarioId, produtoId, nota,
            comentario ?? null, new Date().toISOString());
    }

    // Recalcula média
    const { media } = db.prepare(
    'SELECT AVG(nota) AS media FROM avaliacoes WHERE produto_id = ?'
    ).get(produtoId);
    db.prepare('UPDATE produtos SET rating=? WHERE id=?')
    .run(parseFloat(media.toFixed(1)), produtoId);

    const avaliacao = db.prepare(
    'SELECT * FROM avaliacoes WHERE usuario_id=? AND produto_id=?'
    ).get(usuarioId, produtoId);

    return res.status(jaAvaliou ? 200 : 201).json(avaliacao);
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao registrar avaliação.' });
}
};

export const listarAvaliacoesDoProduto = (req, res) => {
try {
    const produtoId = Number(req.params.produtoId);
    const produto = db.prepare(
    'SELECT id, title, rating FROM produtos WHERE id = ?'
    ).get(produtoId);

    if (!produto)
    return res.status(404).json({ erro: 'Produto não encontrado.' });

    const avaliacoes = db.prepare(`
    SELECT a.id, a.nota, a.comentario, a.data, u.nome AS autor
    FROM avaliacoes a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.produto_id = ?
    ORDER BY a.data DESC
    `).all(produtoId);

    return res.status(200).json({
    produto: { id: produto.id, title: produto.title, media: produto.rating },
    total: avaliacoes.length,
    avaliacoes,
    });
} catch (e) {
    return res.status(500).json({ erro: 'Erro ao listar avaliações.' });
}
};