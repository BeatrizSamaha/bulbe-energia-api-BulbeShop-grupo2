import jwt from 'jsonwebtoken';
import { usuarios } from '../data/usuarios.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/auth.js';

// Post - /auth/login

export const login = (req, res) => {
    const { email, senha } = req.body;

    //Teste para presença dos campos
    if (!email || !senha){
        return res.status(400).json({
            erro: 'Osc campos "email" e "senha" são obrigatórios'
        });
    }

}