import { cupons } from '../data/cupons.js';

export const listarDisponiveis = (req, res) => {
  try {
    const cuponsDisponiveis = cupons.filter(cupom => cupom.ativo === true);
    res.status(200).json(cuponsDisponiveis);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupons' });
  }
};