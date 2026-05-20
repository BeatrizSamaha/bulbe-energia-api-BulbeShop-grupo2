// Middleware de autorização por papel.
// Deve ser usado APÓS o middleware autenticar.
//
// Exemplo de uso:
// router.delete('/:id', autenticar, autorizar('admin'), deletarProduto)

export const autorizar = (...papeisPermitidos) => (req, res, next) => {
    const { papel } = req.usuario;

    if (!papeisPermitidos.includes(papel)) {
        return res.status(403).json({
        erro: 'Acesso negado. Você não tem permissão para esta ação.',
    });
    }

    next();
};