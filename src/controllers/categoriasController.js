import { categorias } from '../data/categorias.js';

// GET /api/v1/categorias  im27
export const listarCategorias = (req, res) => {
  try {
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar categorias' });
  }
};