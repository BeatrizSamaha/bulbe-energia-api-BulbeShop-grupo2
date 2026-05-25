import db from '../db/conexao.js';

const formatarPedido = (row) => ({
  id:              row.id,
  usuarioId:       row.usuario_id,
  data:            row.data,
  status:          row.status,
  metodoPagamento: row.metodo_pagamento,
  itens:           typeof row.itens === 'string' ? JSON.parse(row.itens) : (row.itens || []),
  subtotal:        row.subtotal,
  desconto:        row.desconto,
  total:           row.total,
  cupom:           row.cupom,
  canceladoEm:     row.cancelado_em,
});

export const buscarPedidoPorId = (req, res) => {
  const { id } = req.params;
  const usuarioLogadoId = req.usuario?.sub;

  const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));

  if (!row) {
    return res.status(404).json({ mensagem: 'Pedido não encontrado' });
  }

  if (row.usuario_id !== Number(usuarioLogadoId)) {
    return res.status(403).json({ mensagem: 'Acesso negado: este pedido não pertence a você' });
  }

  return res.status(200).json(formatarPedido(row));
};

export const listarPedidos = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const pedidos = db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY data DESC').all(usuarioId)
      .map(formatarPedido);

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar histórico de pedidos.' });
  }
};

// Verifica e debita estoque (transação atômica)
const verificarEstoque = db.transaction((itens) => {
  for (const item of itens) {
    const p = db.prepare('SELECT stock, title FROM produtos WHERE id = ?')
                .get(item.produto_id);
    if (!p)
      throw { status: 404, msg: `Produto ID ${item.produto_id} não encontrado.` };
    if (p.stock < item.quantidade)
      throw { status: 422,
              msg: `Estoque insuficiente para "${item.title}". Disponível: ${p.stock}.` };
  }
  for (const item of itens) {
    const resultado = db.prepare('UPDATE produtos SET stock = stock - ? WHERE id = ?')
      .run(item.quantidade, item.produto_id);
      if (resultado.changes == 0) {
        throw {
          status: 422,
          msg: `Estoque insuficiente para produto ID ${item.produto_id}`,
        };
      }
  }
});

export const iniciarCheckout = (req, res) => {
  try {
    const usuarioId = req.usuario.sub;
    const { cupom: codigoCupom } = req.body;

    const itensDoUsuario = db.prepare('SELECT * FROM carrinho_itens WHERE usuario_id = ?').all(usuarioId);

    if (itensDoUsuario.length === 0) {
      return res.status(422).json({ erro: 'O carrinho está vazio.' });
    }

    try {
      verificarEstoque(itensDoUsuario);
    } catch (err) {
      return res.status(err.status || 422).json({ erro: err.msg || 'Erro de estoque.' });
    }

    const subtotal = itensDoUsuario.reduce((acc, item) => acc + item.price * item.quantidade, 0);

    let desconto = 0;
    let cupomAplicado = null;

    if (codigoCupom) {
      const cupomEncontrado = db.prepare('SELECT * FROM cupons WHERE codigo = ? AND ativo = 1').get(codigoCupom);

      if (!cupomEncontrado) {
        return res.status(422).json({ erro: 'Cupom inválido ou expirado.' });
      }

      const hoje = new Date().toISOString().slice(0, 10);
      if (cupomEncontrado.validade && cupomEncontrado.validade < hoje) {
        return res.status(422).json({ erro: 'Cupom inválido ou expirado.' });
      }

      desconto = cupomEncontrado.tipo === '%'
        ? subtotal * (cupomEncontrado.desconto / 100)
        : cupomEncontrado.desconto;
      cupomAplicado = codigoCupom;
    }

    const total = Number(Math.max(0, subtotal - desconto).toFixed(2));
    const data  = new Date().toISOString();
    const itens = itensDoUsuario.map(({ produto_id, title, quantidade, price }) => ({ produtoId: produto_id, title, quantidade, price }));

    const resultado = db.prepare(`
  INSERT INTO pedidos
    (usuario_id, data, status, metodo_pagamento,
    itens, subtotal, desconto, total, cupom, cancelado_em, endereco_entrega)
  VALUES (?, ?, 'ativo', NULL, ?, ?, ?, ?, ?, NULL, ?)
`).run(
  usuarioId,
  data,
  JSON.stringify(itens),
  Number(subtotal.toFixed(2)),
  Number(desconto.toFixed(2)),
  total,
  cupomAplicado,
  req.body.endereco ? JSON.stringify(req.body.endereco) : null,
);

    db.prepare('DELETE FROM carrinho_itens WHERE usuario_id = ?').run(usuarioId);

    const novoPedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(resultado.lastInsertRowid);
    return res.status(201).json(formatarPedido(novoPedido));
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno ao iniciar checkout.' });
  }
};

export const cancelarPedido = (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.sub;

    const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));

    if (!row) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }

    if (row.usuario_id !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para cancelar este pedido.' });
    }

    if (row.status === 'concluido' || row.status === 'cancelado') {
      return res.status(422).json({ mensagem: `Não é possível cancelar um pedido que já está ${row.status}.` });
    }

    const canceladoEm = new Date().toISOString();
    db.prepare('UPDATE pedidos SET status = ?, cancelado_em = ? WHERE id = ?').run('cancelado', canceladoEm, Number(id));

    const pedidoAtualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));
    return res.status(200).json({ mensagem: 'Pedido cancelado com sucesso', pedido: formatarPedido(pedidoAtualizado) });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao cancelar pedido.' });
  }
};

export const aplicarCupom = (req, res) => {
  try {
    const { id } = req.params;
    const { codigo } = req.body;
    const usuarioId = req.usuario.sub;

    const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));

    if (!row) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }

    if (row.usuario_id !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para alterar esse pedido.' });
    }

    if (row.status === 'concluido' || row.status === 'cancelado') {
      return res.status(422).json({ mensagem: 'Não é possível aplicar cupom neste pedido.' });
    }

    const cupom = db.prepare('SELECT * FROM cupons WHERE codigo = ? AND ativo = 1').get(codigo);

    if (!cupom) {
      return res.status(404).json({ mensagem: 'Cupom não encontrado ou inativo.' });
    }

    const hoje = new Date().toISOString().slice(0, 10);
    if (cupom.validade && cupom.validade < hoje) {
      return res.status(410).json({ mensagem: 'Este cupom está expirado.' });
    }

    const cupomJaUsado = db.prepare('SELECT 1 FROM pedidos WHERE usuario_id = ? AND cupom = ?').get(usuarioId, cupom.codigo);

    if (cupomJaUsado) {
      return res.status(422).json({ mensagem: 'Este cupom já foi utilizado.' });
    }

    const desconto = cupom.tipo === '%'
      ? (row.subtotal * cupom.desconto) / 100
      : cupom.desconto;
    const total = Number(Math.max(row.subtotal - desconto, 0).toFixed(2));

    db.prepare('UPDATE pedidos SET cupom = ?, desconto = ?, total = ? WHERE id = ?')
      .run(cupom.codigo, Number(desconto.toFixed(2)), total, Number(id));

    const pedidoAtualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));
    return res.status(200).json({ mensagem: 'Cupom aplicado com sucesso.', pedido: formatarPedido(pedidoAtualizado) });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao aplicar o cupom.' });
  }
};
