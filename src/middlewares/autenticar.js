import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';
import { estaNaBlacklist } from './blacklist.js';

export const autenticar = (req, res, next) => {
  // 1. Pega o cabeçalho de autorização da requisição
  const authHeader = req.headers.authorization;

  // 2. Se não tem cabeçalho, barra logo de cara (401)
  if (!authHeader) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  // 3. O cabeçalho vem no formato "Bearer eyJhbG..." a gente separa pelo espaço para pegar só o token
  const [, token] = authHeader.split(' ');

  // 4. Verifica se o token foi invalidado via logout - immp26
  if (estaNaBlacklist(token)) {
    return res.status(401).json({ erro: 'Token inválido. Faça login novamente.' });
  }

  try {
    // 5. Tenta abrir e validar o token com a nossa senha secreta
    const payload = jwt.verify(token, JWT_SECRET);

    // 6. Se deu certo, guarda os dados do usuário dentro do 'req' e deixa a requisição passar!
    req.usuario = payload;
    next();
  } catch (error) {
    // 7. Se o token for falso, alterado ou estiver expirado, barra aqui
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};