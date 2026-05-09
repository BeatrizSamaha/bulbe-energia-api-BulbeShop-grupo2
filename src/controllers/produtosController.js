import { produtos } from '../data/produtos.js';

export const listarProdutos = (req, res) => {
  try {
    const { busca } = req.query;

    let resultado = produtos;

    if (busca) {
        const termo = busca.toLowerCase();
        resultado = resultado.filter((produto) =>
            produto.title.toLowerCase().includes(termo)
        );
    }

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produtos' });
  }
};