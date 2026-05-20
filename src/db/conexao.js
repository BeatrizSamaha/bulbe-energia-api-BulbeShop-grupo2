import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DB_PATH = join(__dirname, '..', '..', 'bulbe.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// criaçao das tabelas 
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nome   TEXT    NOT NULL,
    email  TEXT    NOT NULL UNIQUE,
    senha  TEXT    NOT NULL,
    papel  TEXT    NOT NULL DEFAULT 'cliente'
          CHECK (papel IN ('admin', 'cliente')),
    pontos INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS categorias (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT    NOT NULL UNIQUE,
    slug TEXT    NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL,
    category    TEXT,
    stock       INTEGER NOT NULL DEFAULT 0,
    image       TEXT,
    rating      REAL,
    variations  TEXT
  );

  CREATE TABLE IF NOT EXISTS lojas (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT    NOT NULL,
    endereco TEXT,
    telefone TEXT,
    horario  TEXT,
    produtos TEXT,
    estado   TEXT,
    ativa    INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS cupons (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo   TEXT    NOT NULL UNIQUE,
    desconto REAL    NOT NULL,
    tipo     TEXT    NOT NULL CHECK (tipo IN ('%', 'R$')),
    validade TEXT,
    ativo    INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS carrinho_itens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    title      TEXT    NOT NULL,
    price      REAL    NOT NULL,
    image      TEXT,
    quantidade INTEGER NOT NULL DEFAULT 1,
    UNIQUE (usuario_id, produto_id)
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id       INTEGER NOT NULL REFERENCES usuarios(id),
    data             TEXT    NOT NULL DEFAULT (datetime('now')),
    status           TEXT    NOT NULL DEFAULT 'ativo'
                     CHECK (status IN ('ativo', 'concluido', 'cancelado')),
    metodo_pagamento TEXT,
    itens            TEXT,
    subtotal         REAL    NOT NULL DEFAULT 0,
    desconto         REAL    NOT NULL DEFAULT 0,
    total            REAL    NOT NULL DEFAULT 0,
    cupom            TEXT,
    cancelado_em     TEXT
  );

  CREATE TABLE IF NOT EXISTS favoritos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    UNIQUE (usuario_id, produto_id)
  );

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    nota       INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data       TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (usuario_id, produto_id)
  );
`);

// Migrações
const colunasProdutos = db.pragma('table_info(produtos)').map((c) => c.name);
if (!colunasProdutos.includes('destaque')) {
  db.exec('ALTER TABLE produtos ADD COLUMN destaque INTEGER NOT NULL DEFAULT 0;');
  console.log('[DB] Migração: coluna "destaque" adicionada à tabela produtos.');
}

const colunasPedidos2 = db.pragma('table_info(pedidos)').map((c) => c.name);
if (!colunasPedidos2.includes('endereco_entrega')) {
  db.exec('ALTER TABLE pedidos ADD COLUMN endereco_entrega TEXT;');
  console.log('[DB] Migração: coluna "endereco_entrega" adicionada.');
}
// Adiciona a coluna 'itens' na tabela pedidos caso o banco tenha sido criado
// com o schema antigo (sem essa coluna). O CREATE TABLE IF NOT EXISTS não
// atualiza tabelas já existentes, por isso esta verificação é necessária.
const colunasPedidos = db.pragma('table_info(pedidos)').map((c) => c.name);

if (!colunasPedidos.includes('itens')) {
  db.exec(`ALTER TABLE pedidos ADD COLUMN itens TEXT;`);
  console.log('[DB] Migração aplicada: coluna "itens" adicionada à tabela pedidos.');
}

export default db;