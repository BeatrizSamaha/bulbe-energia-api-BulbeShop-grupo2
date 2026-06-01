
import bcrypt from 'bcryptjs';
import db from '../db/conexao.js';

export const verPerfil = (req, res) => {
  const usuario = db.prepare('SELECT id, nome, email, telefone, cpf, endereco, papel, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  return res.status(200).json(usuario);
};

export const editarPerfil = async (req, res) => {
  const { nome, senha, email, telefone, cpf, endereco } = req.body;

  if (!nome && !senha && !email && !telefone && !cpf && !endereco) {
    return res.status(400).json({ mensagem: 'Informe ao menos um campo para atualizar.' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  if (email && email !== usuario.email) {
    const emailEmUso = db.prepare('SELECT id FROM usuarios WHERE email = ? AND id != ?').get(email, req.usuario.sub);
    if (emailEmUso) {
      return res.status(409).json({ mensagem: 'Este e-mail já está em uso por outro usuário.' });
    }
    db.prepare('UPDATE usuarios SET email = ? WHERE id = ?').run(email, req.usuario.sub);
  }

  if (nome)     db.prepare('UPDATE usuarios SET nome     = ? WHERE id = ?').run(nome,     req.usuario.sub);
  if (telefone) db.prepare('UPDATE usuarios SET telefone = ? WHERE id = ?').run(telefone, req.usuario.sub);
  if (cpf)      db.prepare('UPDATE usuarios SET cpf      = ? WHERE id = ?').run(cpf,      req.usuario.sub);
  if (endereco) db.prepare('UPDATE usuarios SET endereco = ? WHERE id = ?').run(endereco, req.usuario.sub);
  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    db.prepare('UPDATE usuarios SET senha = ? WHERE id = ?').run(senhaHash, req.usuario.sub);
  }

  const perfil = db.prepare('SELECT id, nome, email, telefone, cpf, endereco, papel, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);
  return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso.', perfil });
};

export const consultarPontos = (req, res) => {
  const usuario = db.prepare('SELECT nome, pontos FROM usuarios WHERE id = ?').get(req.usuario.sub);

  if (!usuario) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }

  return res.status(200).json({ usuario: usuario.nome, pontos: usuario.pontos });
};
