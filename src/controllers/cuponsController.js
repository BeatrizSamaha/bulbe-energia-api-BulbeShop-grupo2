const cuponsDb = [
  { id: 1, codigo: 'BEMVINDO10', valor: 10.00, ativo: true },
  { id: 2, codigo: 'SOLAR20', valor: 20.00, ativo: true },
  { id: 3, codigo: 'EXPIRADO5', valor: 5.00, ativo: false } // Cupom indisponível
];

export const listarDisponiveis = (req, res) => {
  try {
    const cuponsDisponiveis = cuponsDb.filter(cupom => cupom.ativo === true);
    res.status(200).json(cuponsDisponiveis);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupons' });
  }
};