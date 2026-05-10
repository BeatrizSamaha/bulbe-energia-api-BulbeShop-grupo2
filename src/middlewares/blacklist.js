// Guarda tokens invalidados em memória enquanto o servidor roda
const blacklist = new Set();

export const adicionarNaBlacklist = (token) => {
  blacklist.add(token);
};

export const estaNaBlacklist = (token) => {
  return blacklist.has(token);
};