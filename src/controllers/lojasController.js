import { lojas } from '../data/lojas.js';

// GET /api/v1/lojas-parceiras
export const listarLojas = (req, res) => {
  try {
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};

// GET /api/v1/lojas-parceiras/:id 
export const buscarLojaPorId = (req, res) => {
  try {
    const loja = lojas.find((l) => l.id === Number(req.params.id));

    if (!loja) {
      return res.status(404).json({ erro: 'Loja parceira não encontrada.' });
    }

    res.status(200).json(loja);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar loja parceira' });
  }
};