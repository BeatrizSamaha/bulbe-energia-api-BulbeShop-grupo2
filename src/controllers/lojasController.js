// Simulação de banco de dados em memória para Lojas Parceiras
const lojasDb = [
  { id: 1, nome: 'SolarTech Equipamentos', estado: 'SP', ativa: true },
  { id: 2, nome: 'Eólica Sul Peças', estado: 'RS', ativa: true },
  { id: 3, nome: 'Norte Baterias', estado: 'AM', ativa: false }
];

// Função para listar todas as lojas (podemos filtrar só as ativas no frontend, ou retornar todas)
export const listarLojas = (req, res) => {
  try {
    // Retorna status 200 OK com o JSON da lista
    res.status(200).json(lojasDb);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};