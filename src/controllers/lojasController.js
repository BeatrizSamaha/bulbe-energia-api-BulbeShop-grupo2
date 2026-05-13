import db from '../db/conexao.js';

const parseLoja = (loja) => ({
  ...loja,
  produtos: loja.produtos ? JSON.parse(loja.produtos) : [],
  ativa: loja.ativa === 1,
});

export const listarLojas = (req, res) => {
  try {
    const lojas = db.prepare('SELECT * FROM lojas WHERE ativa = 1').all().map(parseLoja);
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};

export const buscarLojaPorId = (req, res) => {
  try {
    const loja = db.prepare('SELECT * FROM lojas WHERE id = ?').get(Number(req.params.id));

    if (!loja) {
      return res.status(404).json({ erro: 'Loja parceira não encontrada.' });
    }

    res.status(200).json(parseLoja(loja));
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar loja parceira' });
  }
};
