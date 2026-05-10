import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usuarios } from "../data/usuarios.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/auth.js";
import { adicionarNaBlacklist } from "../middlewares/blacklist.js";

// POST /api/v1/auth/login
export const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: 'Os campos "email" e "senha" são obrigatórios',
    });
  }

  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({
      erro: "Credenciais inválidas",
    });
  }

  const payload = {
    sub: usuario.id,
    nome: usuario.nome,
    papel: usuario.papel,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return res.status(200).json({
    mensagem: "Autenticação realizada com sucesso.",
    token,
    expira_em: JWT_EXPIRES_IN,
  });
};

export const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    // 1. Validar campos obrigatórios
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    // 2. Verificar se o e-mail já existe (Conflito - 409)
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    // 3. Criptografar a senha (Hash)
    const senhaHash = await bcrypt.hash(senha, 10);

    // 4. Criar o novo usuário e salvar no "banco"
    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha: senhaHash, // Salva a senha protegida
        papel: 'cliente'  // Padrão para novos registros
    };
    usuarios.push(novoUsuario);

    // 5. Gerar token para o usuário já logar automaticamente
    const token = jwt.sign(
        { sub: novoUsuario.id, nome: novoUsuario.nome, papel: novoUsuario.papel },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        token
    });
};

// POST /api/v1/auth/logout  imp 26
export const logout = (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ erro: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  adicionarNaBlacklist(token);

  return res.status(200).json({ mensagem: "Logout realizado com sucesso." });
};
