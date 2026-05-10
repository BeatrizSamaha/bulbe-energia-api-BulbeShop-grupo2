import { carrinho } from '../data/carrinho.js';
import { produtos } from '../data/produtos.js';

export const listarItens = (req, res) => {
  try {
    const itens = carrinho.map((item) => ({
      id: item.produtoId,
      title: item.title,
      price: item.price,
      img: item.img,
      qty: item.quantidade,
    }));
 
    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao listar itens do carrinho' });
  }
};

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

export const atualizarQuantidade = (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (quantidade === undefined || quantidade === null) {
      return res.status(422).json({ erro: 'O campo "quantidade" é obrigatório.' });
    }

    const qtd = Number(quantidade);

    if (!Number.isInteger(qtd) || qtd < 1) {
      return res.status(422).json({ erro: 'O campo "quantidade" deve ser um número inteiro maior que zero.' });
    }

    const item = carrinho.find((i) => i.produtoId === Number(id));

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado no carrinho.' });
    }

    item.quantidade = qtd;

    return res.status(200).json(carrinho);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao atualizar quantidade do item.' });
  }
};

export const removerItem = (req, res) => {
  try {
    const { id } = req.params;

    const index = carrinho.findIndex((i) => i.produtoId === Number(id));

    if (index === -1) {
      return res.status(404).json({ erro: 'Item não encontrado no carrinho.' });
    }

    carrinho.splice(index, 1);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao remover item do carrinho.' });
  }
};