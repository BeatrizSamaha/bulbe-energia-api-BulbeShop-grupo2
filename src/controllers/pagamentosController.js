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

const validarPedido = (id, usuarioId, res) => {
  const row = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(Number(id));

  if (!row) {
    res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    return null;
  }

  if (row.usuario_id !== usuarioId) {
    res.status(403).json({ mensagem: 'Acesso negado.' });
    return null;
  }

  if (row.metodo_pagamento !== null) {
    res.status(422).json({ mensagem: 'Este pedido já foi pago.' });
    return null;
  }

  return row;
};

export const processarPagamentoPix = (req, res) => {
  const usuarioId = req.usuario.sub;
  const row = validarPedido(req.params.id, usuarioId, res);
  if (!row) return;

  db.prepare('UPDATE pedidos SET metodo_pagamento = ?, status = ? WHERE id = ?')
    .run('pix', 'concluido', row.id);

  const pedidoAtualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(row.id);

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pagamento: {
      metodo:    'pix',
      chavePix:  'bulbeshop@pix.com.br',
      qrCode:    '00020126580014br.gov.bcb.pix0136bulbeshop@pix.com.br',
      expiracao: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  });
};

export const processarPagamentoBoleto = (req, res) => {
  const usuarioId = req.usuario.sub;
  const row = validarPedido(req.params.id, usuarioId, res);
  if (!row) return;

  db.prepare('UPDATE pedidos SET metodo_pagamento = ?, status = ? WHERE id = ?')
    .run('boleto', 'concluido', row.id);

  const pedidoAtualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(row.id);

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pagamento: {
      metodo:         'boleto',
      codigoBarras:   '34191.79001 01043.510047 91020.150008 1 00000003780',
      linhaDigitavel: '34191790010104351004791020150008100000003780',
      vencimento:     new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
};

export const processarPagamentoCartao = (req, res) => {
  const usuarioId = req.usuario.sub;
  const { cartao } = req.body;

  if (!cartao || !cartao.tipo) {
    return res.status(400).json({ mensagem: 'Informe os dados do cartão (tipo: debito ou credito).' });
  }

  if (!['debito', 'credito'].includes(cartao.tipo)) {
    return res.status(400).json({ mensagem: 'Tipo de cartão inválido. Use "debito" ou "credito".' });
  }

  const row = validarPedido(req.params.id, usuarioId, res);
  if (!row) return;

  const parcelas       = cartao.tipo === 'credito' ? (cartao.parcelas || 1) : 1;
  const metodoPagamento = cartao.tipo === 'credito' ? 'cartao_credito' : 'cartao_debito';

  db.prepare('UPDATE pedidos SET metodo_pagamento = ?, status = ? WHERE id = ?')
    .run(metodoPagamento, 'concluido', row.id);

  const pedidoAtualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(row.id);

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pagamento: {
      metodo:          metodoPagamento,
      status:          'aprovado',
      bandeira:        'Visa',
      ultimos4Digitos: '1234',
      parcelas,
      valorParcela:    parseFloat((row.total / parcelas).toFixed(2)),
      autorizacao:     `AUTH-${Date.now()}`,
    },
  });
};
