import db from '../db/conexao.js';

const listarFavoritosUsuario = (usuarioId) =>
  db.prepare(`
    SELECT f.id, f.produto_id AS produtoId, p.title, p.price, p.image
    FROM favoritos f
    JOIN produtos p ON f.produto_id = p.id
    WHERE f.usuario_id = ?
  `).all(usuarioId);

export const favoritarProduto = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { produtoId } = req.params;

    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(Number(produtoId));

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const jaFavoritado = db.prepare(
      'SELECT * FROM favoritos WHERE produto_id = ? AND usuario_id = ?'
    ).get(Number(produtoId), usuarioId);

    if (jaFavoritado) {
      return res.status(422).json({ erro: 'Produto já está nos favoritos.' });
    }

    db.prepare(
      'INSERT INTO favoritos (usuario_id, produto_id) VALUES (?, ?)'
    ).run(usuarioId, Number(produtoId));

    return res.status(201).json(listarFavoritosUsuario(usuarioId));
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao favoritar produto.' });
  }
};

export const desfavoritarProduto = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { produtoId } = req.params;

    const favorito = db.prepare(
      'SELECT * FROM favoritos WHERE produto_id = ? AND usuario_id = ?'
    ).get(Number(produtoId), usuarioId);

    if (!favorito) {
      return res.status(404).json({ erro: 'Produto não encontrado nos favoritos.' });
    }

    db.prepare(
      'DELETE FROM favoritos WHERE produto_id = ? AND usuario_id = ?'
    ).run(Number(produtoId), usuarioId);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao desfavoritar produto.' });
  }
};

export const listarFavoritos = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    return res.status(200).json(listarFavoritosUsuario(usuarioId));
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao listar favoritos.' });
  }
};
