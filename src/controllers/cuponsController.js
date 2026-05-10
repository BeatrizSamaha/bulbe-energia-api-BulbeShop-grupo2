import { cupons } from '../data/cupons.js';

// GET /api/v1/cupons
export const listarDisponiveis = (req, res) => {
  try {
    const cuponsDisponiveis = cupons.filter((cupom) => cupom.ativo === true);
    res.status(200).json(cuponsDisponiveis);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupons' });
  }
};

// GET /api/v1/cupons/:codigo  
export const buscarCupomPorCodigo = (req, res) => {
  try {
    const { codigo } = req.params;

    const cupom = cupons.find(
      (c) => c.codigo.toLowerCase() === codigo.toLowerCase()
    );

    // 404 - cupom não existe
    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    }

    // 410 - cupom expirado/inativo
    if (!cupom.ativo) {
      return res.status(410).json({ erro: 'Este cupom está expirado.' });
    }

    res.status(200).json(cupom);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupom' });
  }
};