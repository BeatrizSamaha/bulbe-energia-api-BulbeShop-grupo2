import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/conexao.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth.js';
import { adicionarNaBlacklist } from '../middlewares/blacklist.js';

export const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Os campos "nome", "email" e "senha" são obrigatórios.' });
  }

  const emailExistente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (emailExistente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const resultado = db.prepare(
    `INSERT INTO usuarios (nome, email, senha, papel, pontos) VALUES (?, ?, ?, 'cliente', 0)`
  ).run(nome, email, senhaHash);

  const payload = { sub: resultado.lastInsertRowid, nome, papel: 'cliente' };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.status(201).json({
    mensagem: 'Cadastro realizado com sucesso.',
    token,
    expira_em: JWT_EXPIRES_IN,
  });
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Os campos "email" e "senha" são obrigatórios.' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const payload = {
    sub:   usuario.id,
    nome:  usuario.nome,
    papel: usuario.papel,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.status(200).json({
    mensagem: 'Autenticação realizada com sucesso.',
    token,
    expira_em: JWT_EXPIRES_IN,
  });
};

export const logout = (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ erro: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  adicionarNaBlacklist(token);

  return res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
};