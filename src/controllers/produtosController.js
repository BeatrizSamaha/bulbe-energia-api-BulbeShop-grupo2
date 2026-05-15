import db from '../db/conexao.js';

const parseProduto = (p) => ({
  ...p,
  variations: p.variations ? JSON.parse(p.variations) : [],
});

export const listarProdutos = (req, res) => {
  try {
    const { busca, categoria, page, limit } = req.query;

    let query = 'SELECT * FROM produtos WHERE 1=1';
    const params = [];

    if (busca) {
      query += ' AND LOWER(title) LIKE LOWER(?)';
      params.push(`%${busca}%`);
    }

    if (categoria) {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(categoria.trim());
    }

    const todos = db.prepare(query).all(...params).map(parseProduto);

    const paginaAtual = Math.max(1, parseInt(page) || 1);
    const itensPorPagina = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const total = todos.length;
    const totalPages = Math.ceil(total / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return res.status(200).json({
      data: todos.slice(inicio, fim),
      total,
      page: paginaAtual,
      limit: itensPorPagina,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produtos' });
  }
};

export const buscarProdutoPorId = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: 'O ID informado é inválido.' });
    }

    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.status(200).json(parseProduto(produto));
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produto' });
  }
};
