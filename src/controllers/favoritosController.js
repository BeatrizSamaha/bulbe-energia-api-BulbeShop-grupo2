import { favoritos } from '../data/favoritos.js';
import { produtos } from '../data/produtos.js';

export const favoritarProduto = (req, res) => {
    try {
        const { produtoId } = req.params;

        const produto = produtos.find((p) => p.id === Number(produtoId));

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        const jaFavoritado = favoritos.find((f) => f.produtoId === Number(produtoId));

        if (jaFavoritado) {
            return res.status(422).json({ erro: 'Produto já está nos favoritos.' });
        }

        favoritos.push({
            produtoId: Number(produtoId),
            title: produto.title,
            price: produto.price,
            image: produto.image,
        });

        return res.status(201).json(favoritos);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno ao favoritar produto.' });
    }
};

export const desfavoritarProduto = (req, res) => {
    try {
        const { produtoId } = req.params;

        const index = favoritos.findIndex((f) => f.produtoId === Number(produtoId));

        if (index === -1) {
            return res.status(404).json({ erro: 'Produto não encontrado nos favoritos.' });
        }

        favoritos.splice(index, 1);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno ao desfavoritar produto.' });
    }
};

export const listarFavoritos = (req, res) => {
    try {
        return res.status(200).json(favoritos);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno ao listar favoritos.' });
    }
}