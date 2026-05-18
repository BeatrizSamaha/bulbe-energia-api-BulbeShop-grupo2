import db from '../db/conexao.js';

export const listarItens = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const itens = db.prepare('SELECT * FROM carrinho_itens WHERE usuario_id = ?').all(usuarioId)
      .map((item) => ({
        id:    item.produto_id,
        title: item.title,
        price: item.price,
        img: item.image,
        qty:   item.quantidade,
      }));

    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao listar itens do carrinho' });
  }
};

export const adicionarItem = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { produtoId, quantidade = 1 } = req.body;

    if (!produtoId) {
      return res.status(400).json({ erro: 'O campo "produtoId" é obrigatório.' });
    }

    const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(Number(produtoId));

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const itemExistente = db.prepare(
      'SELECT * FROM carrinho_itens WHERE usuario_id = ? AND produto_id = ?'
    ).get(usuarioId, Number(produtoId));

    if (itemExistente) {
      db.prepare(
        'UPDATE carrinho_itens SET quantidade = quantidade + ? WHERE usuario_id = ? AND produto_id = ?'
      ).run(Number(quantidade), usuarioId, Number(produtoId));
    } else {
      db.prepare(
        'INSERT INTO carrinho_itens (usuario_id, produto_id, title, price, image, quantidade) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(usuarioId, Number(produtoId), produto.title, produto.price, produto.image, Number(quantidade));
    }

    const carrinhoUsuario = db.prepare('SELECT * FROM carrinho_itens WHERE usuario_id = ?').all(usuarioId);
    res.status(201).json(carrinhoUsuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao adicionar item ao carrinho' });
  }
};

export const atualizarQuantidade = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { id } = req.params;
    const { quantidade } = req.body;

    if (quantidade === undefined || quantidade === null) {
      return res.status(422).json({ erro: 'O campo "quantidade" é obrigatório.' });
    }

    const qtd = Number(quantidade);

    if (!Number.isInteger(qtd) || qtd < 1) {
      return res.status(422).json({ erro: 'O campo "quantidade" deve ser um número inteiro maior que zero.' });
    }

    const item = db.prepare(
      'SELECT * FROM carrinho_itens WHERE produto_id = ? AND usuario_id = ?'
    ).get(Number(id), usuarioId);

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado no carrinho.' });
    }

    db.prepare(
      'UPDATE carrinho_itens SET quantidade = ? WHERE produto_id = ? AND usuario_id = ?'
    ).run(qtd, Number(id), usuarioId);

    const carrinhoUsuario = db.prepare('SELECT * FROM carrinho_itens WHERE usuario_id = ?').all(usuarioId);
    return res.status(200).json(carrinhoUsuario);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao atualizar quantidade do item.' });
  }
};

export const removerItem = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { id } = req.params;

    const item = db.prepare(
      'SELECT * FROM carrinho_itens WHERE produto_id = ? AND usuario_id = ?'
    ).get(Number(id), usuarioId);

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado no carrinho.' });
    }

    db.prepare(
      'DELETE FROM carrinho_itens WHERE produto_id = ? AND usuario_id = ?'
    ).run(Number(id), usuarioId);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao remover item do carrinho.' });
  }
};
