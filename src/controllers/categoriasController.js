import db from '../db/conexao.js';

export const listarCategorias = (req, res) => {
  try {
    const categorias = db.prepare('SELECT * FROM categorias').all();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar categorias' });
  }
};
