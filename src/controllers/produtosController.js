import { produtos } from '../data/produtos.js';

// GET /api/v1/produtos  [IMP-30 - com paginação]
export const listarProdutos = (req, res) => {
  try {
    const { busca, categoria, page, limit } = req.query;
    let resultado = produtos;

    // Filtro por busca no título
    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter((produto) =>
        produto.title.toLowerCase().includes(termo)
      );
    }

    // Filtro por categoria [compatível com IMP-03]
    if (categoria) {
      const termo = categoria.toLowerCase();
      resultado = resultado.filter((produto) =>
        produto.category.toLowerCase() === termo
      );
    }

    // Paginação [IMP-30]
    const paginaAtual = Math.max(1, parseInt(page) || 1);
    const itensPorPagina = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const total = resultado.length;
    const totalPages = Math.ceil(total / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return res.status(200).json({
      data: resultado.slice(inicio, fim),
      total,
      page: paginaAtual,
      limit: itensPorPagina,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar produtos' });
  }
};

// GET /api/v1/produtos/:id
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