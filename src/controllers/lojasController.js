import db from '../db/conexao.js';

const parseLoja = (loja) => ({
  ...loja,
  produtos: loja.produtos ? JSON.parse(loja.produtos) : [],
  ativa: loja.ativa === 1,
});

export const listarLojas = (req, res) => {
  try {
    const lojas = db.prepare('SELECT * FROM lojas WHERE ativa = 1').all().map(parseLoja);
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar lojas parceiras' });
  }
};

export const buscarLojaPorId = (req, res) => {
  try {
    const loja = db.prepare('SELECT * FROM lojas WHERE id = ?').get(Number(req.params.id));

    if (!loja) {
      return res.status(404).json({ erro: 'Loja parceira não encontrada.' });
    }

    res.status(200).json(parseLoja(loja));
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar loja parceira' });
  }
};

export const criarLoja = (req, res) => {
  try {
    const { nome, endereco, telefone, horario,
            produtos, estado, ativa } = req.body;
    const r = db.prepare(`
      INSERT INTO lojas
        (nome, endereco, telefone, horario, produtos, estado, ativa)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(nome, endereco ?? null, telefone ?? null,
          horario ?? null,
          produtos ? JSON.stringify(produtos) : null,
          estado ?? null,
          ativa !== undefined ? (ativa ? 1 : 0) : 1);

    return res.status(201).json(
      parseLoja(db.prepare('SELECT * FROM lojas WHERE id = ?')
                  .get(r.lastInsertRowid))
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao criar loja.' });
  }
};

export const atualizarLoja = (req, res) => {
  try {
    const id = Number(req.params.id);
    const l  = db.prepare('SELECT * FROM lojas WHERE id = ?').get(id);
    if (!l) return res.status(404).json({ erro: 'Loja não encontrada.' });

    const { nome, endereco, telefone, horario,
            produtos, estado, ativa } = req.body;
    db.prepare(`
      UPDATE lojas
      SET nome=?, endereco=?, telefone=?, horario=?,
          produtos=?, estado=?, ativa=?
      WHERE id=?
    `).run(
      nome     ?? l.nome,
      endereco ?? l.endereco,
      telefone ?? l.telefone,
      horario  ?? l.horario,
      produtos ? JSON.stringify(produtos) : l.produtos,
      estado   ?? l.estado,
      ativa !== undefined ? (ativa ? 1 : 0) : l.ativa,
      id,
    );
    return res.status(200).json(
      parseLoja(db.prepare('SELECT * FROM lojas WHERE id = ?').get(id))
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao atualizar loja.' });
  }
};

export const deletarLoja = (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!db.prepare('SELECT id FROM lojas WHERE id = ?').get(id))
      return res.status(404).json({ erro: 'Loja não encontrada.' });
    db.prepare('DELETE FROM lojas WHERE id = ?').run(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao deletar loja.' });
  }
};