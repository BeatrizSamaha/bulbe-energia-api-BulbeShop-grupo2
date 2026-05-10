import { carrinho } from '../data/carrinho.js';
import { produtos } from '../data/produtos.js';

export const adicionarItem = (req, res) => {
  try {
    const { produtoId, quantidade = 1 } = req.body;

    if (!produtoId) {
      return res.status(400).json({ erro: 'O campo "produtoId" é obrigatório.' });
    }

    const produto = produtos.find((p) => p.id === Number(produtoId));

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const itemExistente = carrinho.find((item) => item.produtoId === Number(produtoId));

    if (itemExistente) {
      itemExistente.quantidade += Number(quantidade);
    } else {
      carrinho.push({
        produtoId: Number(produtoId),
        title: produto.title,
        price: produto.price,
        img: produto.img,
        quantidade: Number(quantidade),
      });
    }

    res.status(201).json(carrinho);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao adicionar item ao carrinho' });
  }
};