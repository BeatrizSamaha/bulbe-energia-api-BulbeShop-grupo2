import jwt from "jsonwebtoken";
import { usuarios } from "../data/usuarios.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/auth.js";

// Post - /auth/login

export const login = (req, res) => {
    const { email, senha } = req.body;

    //Teste para presença dos campos
    if (!email || !senha) {
        return res.status(400).json({
            erro: 'Os campos "email" e "senha" são obrigatórios',
        });
    }

    //Buscar email
    const usuario = usuarios.find((u) => u.email === email);

    //verificar usuario e senha
    if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({
            erro: "Credenciais inválidas",
        });
    }

    //payload
    const payload = {
        sub: usuario.id,
        nome: usuario.nome,
        papel: usuario.papel,
    };

    //Gerar o token JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    //Retornar o token ao cliente
    return res.status(200).json({
        mensagem: "Autenticação realizada com sucesso.",
        token,
        expira_em: JWT_EXPIRES_IN,
    });
};
