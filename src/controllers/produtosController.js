import { produtos } from '../data/produtos.js';

export const listarProdutos = (req, res) => {
  try {
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produtos' });
  }
};