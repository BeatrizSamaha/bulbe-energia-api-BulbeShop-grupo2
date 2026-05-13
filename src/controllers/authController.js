import jwt from 'jsonwebtoken';
import db from '../db/conexao.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth.js';
import { adicionarNaBlacklist } from '../middlewares/blacklist.js';

export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Os campos "email" e "senha" são obrigatórios' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
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
