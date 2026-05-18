import db from '../db/conexao.js';

export const verPerfil = (req, res) => {
  const usuario = db.prepare('SELECT id, nome, email, papel, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }

  return res.status(200).json(usuario);
};

export const editarPerfil = (req, res) => {
  const { nome, senha } = req.body;

  if (!nome && !senha) {
    return res.status(400).json({ erro: 'Informe ao menos um campo para atualizar (nome ou senha).' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }

  if (nome) db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome, req.usuario.sub);
  if (senha) db.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(senha, req.usuario.sub);

  const perfil = db.prepare('SELECT id, nome, email, papel, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);
  return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso.', perfil });
};

export const consultarPontos = (req, res) => {
  const usuario = db.prepare('SELECT nome, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }

  return res.status(200).json({ usuario: usuario.nome, pontos: usuario.pontos });
};
