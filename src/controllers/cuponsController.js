import db from '../db/conexao.js';

export const listarDisponiveis = (req, res) => {
  try {
    const cupons = db.prepare('SELECT * FROM cupons WHERE ativo = 1').all();
    res.status(200).json(cupons);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupons' });
  }
};

export const buscarCupomPorCodigo = (req, res) => {
  try {
    const { codigo } = req.params;

    const cupom = db.prepare('SELECT * FROM cupons WHERE LOWER(codigo) = LOWER(?)').get(codigo);

    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    }

    if (!cupom.ativo) {
      return res.status(410).json({ erro: 'Este cupom está expirado.' });
    }

    res.status(200).json(cupom);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupom' });
  }
};
