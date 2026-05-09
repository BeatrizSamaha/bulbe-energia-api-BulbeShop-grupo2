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

export const buscarProdutoPorId = (req, res) => {
  try {
    const produto = produtos.find((p) => p.id === Number(req.params.id));
 
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
 
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produto' });
  }
};