// Recebe um schema Zod e retorna um middleware Express.
// Substitui req.body pelos dados já validados.

export const validar = (schema) => (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
        const erros = resultado.error.errors.map((e) => ({
        campo: e.path.join('.'),
        mensagem: e.message,
        }));
        return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros });
    }

    req.body = resultado.data;
    next();
};