import db from '../db/conexao.js';

export const listarDisponiveis = (req, res) => {
  try {
    const cupons = db.prepare('SELECT * FROM cupons WHERE ativo = 1').all();
    res.status(200).json(cupons);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupons' });
  }
};

export const buscarCupomPorCodigo = (req, res) => {
  try {
    const { codigo } = req.params;

    const cupom = db.prepare('SELECT * FROM cupons WHERE LOWER(codigo) = LOWER(?)').get(codigo);

    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    }

    if (!cupom.ativo) {
      return res.status(410).json({ erro: 'Este cupom está expirado.' });
    }

    res.status(200).json(cupom);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar cupom' });
  }
};

export const criarCupom = (req, res) => {
  try {
    const { codigo, desconto, tipo, validade, ativo } = req.body;
    const existe = db.prepare(
      'SELECT id FROM cupons WHERE LOWER(codigo) = LOWER(?)'
    ).get(codigo);
    if (existe)
      return res.status(409).json({ erro: 'Cupom já cadastrado.' });

    const r = db.prepare(`
      INSERT INTO cupons (codigo, desconto, tipo, validade, ativo)
      VALUES (?, ?, ?, ?, ?)
    `).run(codigo.toUpperCase(), desconto, tipo,
          validade ?? null, ativo ? 1 : 0);

    return res.status(201).json(
      db.prepare('SELECT * FROM cupons WHERE id = ?').get(r.lastInsertRowid)
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao criar cupom.' });
  }
};

export const atualizarCupom = (req, res) => {
  try {
    const id = Number(req.params.id);
    const c  = db.prepare('SELECT * FROM cupons WHERE id = ?').get(id);
    if (!c) return res.status(404).json({ erro: 'Cupom não encontrado.' });

    const { codigo, desconto, tipo, validade, ativo } = req.body;
    db.prepare(`
      UPDATE cupons
      SET codigo=?, desconto=?, tipo=?, validade=?, ativo=?
      WHERE id=?
    `).run(
      codigo   ? codigo.toUpperCase() : c.codigo,
      desconto ?? c.desconto,
      tipo     ?? c.tipo,
      validade ?? c.validade,
      ativo !== undefined ? (ativo ? 1 : 0) : c.ativo,
      id,
    );
    return res.status(200).json(
      db.prepare('SELECT * FROM cupons WHERE id = ?').get(id)
    );
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao atualizar cupom.' });
  }
};

export const deletarCupom = (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!db.prepare('SELECT id FROM cupons WHERE id = ?').get(id))
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    db.prepare('DELETE FROM cupons WHERE id = ?').run(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ erro: 'Erro ao deletar cupom.' });
  }
};
