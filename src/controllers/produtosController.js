import db from '../db/conexao.js';

const parseProduto = (p) => ({
  ...p,
  variations: p.variations ? JSON.parse(p.variations) : [],
});

export const listarProdutos = (req, res) => {
  try {
    const { busca, categoria, destaque, page, limit } = req.query;

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

    if (destaque === 'true') {
      query += ' AND destaque = 1';
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
export const criarProduto = (req, res) => {
  try {
    const { title, description, price, category,
            stock, image, rating, variations } = req.body;

    const r = db.prepare(`
      INSERT INTO produtos
        (title, description, price, category, stock, image, rating, variations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description ?? null, price, category ?? null,
          stock ?? 0, image ?? null, rating ?? null,
          variations ? JSON.stringify(variations) : null);

    const novo = db.prepare('SELECT * FROM produtos WHERE id = ?')
                  .get(r.lastInsertRowid);
    return res.status(201).json(parseProduto(novo));
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao criar produto.' });
  }
};

export const atualizarProduto = (req, res) => {
  try {
    const id = Number(req.params.id);
    const p  = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id);
    if (!p) return res.status(404).json({ erro: 'Produto não encontrado.' });

    const { title, description, price, category,
            stock, image, rating, variations } = req.body;

    db.prepare(`
      UPDATE produtos
      SET title=?, description=?, price=?, category=?,
          stock=?, image=?, rating=?, variations=?
      WHERE id=?
    `).run(
      title       ?? p.title,
      description ?? p.description,
      price       ?? p.price,
      category    ?? p.category,
      stock       ?? p.stock,
      image       ?? p.image,
      rating      ?? p.rating,
      variations  ? JSON.stringify(variations) : p.variations,
      id,
    );

    return res.status(200).json(
      parseProduto(db.prepare('SELECT * FROM produtos WHERE id = ?').get(id))
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
};

export const deletarProduto = (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!db.prepare('SELECT id FROM produtos WHERE id = ?').get(id))
      return res.status(404).json({ erro: 'Produto não encontrado.' });

    db.prepare('DELETE FROM carrinho_itens WHERE produto_id = ?').run(id);
    db.prepare('DELETE FROM favoritos     WHERE produto_id = ?').run(id);
    db.prepare('DELETE FROM produtos      WHERE id = ?').run(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao deletar produto.' });
  }
};

export const atualizarEstoque = (req, res) => {
  try {
    const id  = Number(req.params.id);
    const qtd = Number(req.body.quantidade);

    if (!Number.isInteger(qtd) || qtd < 0)
      return res.status(400).json({ erro: 'Quantidade deve ser inteiro >= 0.' });

    if (!db.prepare('SELECT id FROM produtos WHERE id = ?').get(id))
      return res.status(404).json({ erro: 'Produto não encontrado.' });

    db.prepare('UPDATE produtos SET stock = ? WHERE id = ?').run(qtd, id);
    return res.status(200).json(
      parseProduto(db.prepare('SELECT * FROM produtos WHERE id = ?').get(id))
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao atualizar estoque.' });
  }
};
