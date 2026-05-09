// src/config/auth.js
//
// Configurações centralizadas de autenticação JWT.
//
// ⚠️ ATENÇÃO — boas práticas de segurança:
//   Em produção, JWT_SECRET deve ser lido de uma variável de ambiente:
//     export const JWT_SECRET = process.env.JWT_SECRET;
//   Nunca commite uma chave secreta real em repositórios Git.
//   O valor abaixo é exclusivamente para fins didáticos em ambiente local.

export const JWT_SECRET = "bulbe-energia-segredo-dev-2026";
export const JWT_EXPIRES_IN = "2h";
