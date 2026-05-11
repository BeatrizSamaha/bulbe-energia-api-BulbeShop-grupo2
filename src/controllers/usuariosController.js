import { usuarios } from '../data/usuarios.js';

export const verPerfil = (req, res) => {
    const usuario = usuarios.find((u) => u.id === req.usuario.sub);

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const { senha, ...perfil } = usuario;
    return res.status(200).json(perfil);
};

export const editarPerfil = (req, res) => {
    const { nome, senha } = req.body;

    if (!nome && !senha) {
        return res.status(400).json({ mensagem: 'Informe ao menos um campo para atualizar (nome ou senha).' });
    }

    const usuario = usuarios.find((u) => u.id === req.usuario.sub);

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    if (nome) usuario.nome = nome;
    if (senha) usuario.senha = senha;

    const { senha: _, ...perfil } = usuario;
    return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso.', perfil });
};

export const consultarPontos = (req, res) => {
    const usuario = usuarios.find((u) => u.id === req.usuario.sub);

    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.status(200).json({
        usuario: usuario.nome,
        pontos: usuario.pontos,
    });
};
