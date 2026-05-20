import db from '../db/conexao.js';

const PONTOS_POR_REAL = 1; // 1 ponto para cada R$ 1,00 gasto

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

const concluirPagamento = (pedidoId, usuarioId, metodoPagamento) => {
  db.prepare('UPDATE pedidos SET metodo_pagamento = ?, status = ? WHERE id = ?')
    .run(metodoPagamento, 'concluido', pedidoId);

  // Credita pontos Bulbe: 1 ponto por R$ 1,00 gasto
  const pedido = db.prepare('SELECT total FROM pedidos WHERE id = ?').get(pedidoId);
  const pontosGanhos = Math.floor(pedido.total * PONTOS_POR_REAL);
  db.prepare('UPDATE usuarios SET pontos = pontos + ? WHERE id = ?')
    .run(pontosGanhos, usuarioId);

  return { pedidoAtualizado: db.prepare('SELECT * FROM pedidos WHERE id = ?').get(pedidoId), pontosGanhos };
};

export const processarPagamentoPix = (req, res) => {
  const usuarioId = req.usuario.sub;
  const row = validarPedido(req.params.id, usuarioId, res);
  if (!row) return;

  const { pedidoAtualizado, pontosGanhos } = concluirPagamento(row.id, usuarioId, 'pix');

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pontosGanhos,
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

  const { pedidoAtualizado, pontosGanhos } = concluirPagamento(row.id, usuarioId, 'boleto');

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pontosGanhos,
    pagamento: {
      metodo:         'boleto',
      codigoBarras:   '34191.79001 01043.510047 91020.150008 1 00000003780',
      linhaDigitavel: '34191790010104351004791020150008100000003780',
      vencimento:     new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
};

export const processarPagamentoDebito = (req, res) => {
  const usuarioId = req.usuario.sub;
  const row = validarPedido(req.params.id, usuarioId, res);
  if (!row) return;

  const { pedidoAtualizado, pontosGanhos } = concluirPagamento(row.id, usuarioId, 'cartao_debito');

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pontosGanhos,
    pagamento: {
      metodo:          'cartao_debito',
      status:          'aprovado',
      bandeira:        'Visa',
      ultimos4Digitos: '1234',
      autorizacao:     `AUTH-${Date.now()}`,
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

  const parcelas        = cartao.tipo === 'credito' ? (cartao.parcelas || 1) : 1;
  const metodoPagamento = cartao.tipo === 'credito' ? 'cartao_credito' : 'cartao_debito';

  const { pedidoAtualizado, pontosGanhos } = concluirPagamento(row.id, usuarioId, metodoPagamento);

  return res.status(200).json({
    pedido: formatarPedido(pedidoAtualizado),
    pontosGanhos,
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