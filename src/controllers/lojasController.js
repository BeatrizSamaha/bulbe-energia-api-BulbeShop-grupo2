import { lojas } from '../data/lojas.js';

export const listarLojas = (req, res) => {
  try {
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};