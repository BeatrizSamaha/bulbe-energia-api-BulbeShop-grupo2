const lojasDb = [
  { id: 1, nome: 'SolarTech Equipamentos', estado: 'SP', ativa: true },
  { id: 2, nome: 'Eólica Sul Peças', estado: 'RS', ativa: true },
  { id: 3, nome: 'Norte Baterias', estado: 'AM', ativa: false }
];

export const listarLojas = (req, res) => {
  try {
    res.status(200).json(lojasDb);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};