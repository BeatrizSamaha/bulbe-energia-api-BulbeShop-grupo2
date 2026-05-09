import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

export const autenticar = (req, res, next) => {
    // 1. Pega o cabeçalho de autorização da requisição
    const authHeader = req.headers.authorization;

    // 2. Se não tem cabeçalho, barra logo de cara (401)
    if (!authHeader) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    // 3. O cabeçalho vem no formato "Bearer eyJhbG...", a gente separa pelo espaço para pegar só o token
    const [, token] = authHeader.split(' ');

    try {
        // 4. Tenta abrir e validar o token com a nossa senha secreta
        const payload = jwt.verify(token, JWT_SECRET);
        
        // 5. Se deu certo, guarda os dados do usuário dentro do 'req' e deixa a requisição passar!
        req.usuario = payload;
        next();
    } catch (error) {
        // 6. Se o token for falso, alterado ou estiver expirado, barra aqui
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};