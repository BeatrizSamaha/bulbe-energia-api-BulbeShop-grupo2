export const pedidos = [
    {
      id: 1,
      usuarioId: 1,
      data: "2026-05-01T10:00:00Z",
      status: "concluido",
      itens: [
        { produtoId: 10, nome: "Mouse Pad XL", quantidade: 1, precoUnitario: 80.00 } //Estrutura dos Item provisoria para testar API
      ],
      subtotal: 80.00,
      desconto: 0.00,
      total: 80.00,
      cupom: null,
      canceladoEm: null
    },
    {
      id: 2,
      usuarioId: 2,
      data: "2026-05-03T15:30:00Z",
      status: "ativo",
      itens: [
        { produtoId: 50, nome: "Teclado Gamer", quantidade: 1, precoUnitario: 250.00 },
        { produtoId: 12, nome: "Cabo HDMI", quantidade: 2, precoUnitario: 25.00 }
      ],
      subtotal: 300.00,
      desconto: 0.00,
      total: 300.00,
      cupom: null,
      canceladoEm: null
    },
    {
      id: 3,
      usuarioId: 3,
      data: "2026-05-05T09:15:00Z",
      status: "cancelado",
      itens: [
        { produtoId: 22, nome: "Monitor 24'", quantidade: 1, precoUnitario: 900.00 }
      ],
      subtotal: 900.00,
      desconto: 0.00,
      total: 900.00,
      cupom: null,
      canceladoEm: "2026-05-05T10:00:00Z"
    },
    {
      id: 4,
      usuarioId: 4,
      data: "2026-05-07T18:45:00Z",
      status: "ativo",
      itens: [
        { produtoId: 5, nome: "Headset USB", quantidade: 1, precoUnitario: 150.00 }
      ],
      subtotal: 150.00,
      desconto: 15.00,
      total: 135.00,
      cupom: "PROMO10",
      canceladoEm: null
    },
    {
      id: 5,
      usuarioId: 5,
      data: "2026-05-08T11:20:00Z",
      status: "concluido",
      itens: [
        { produtoId: 3, nome: "Webcam Full HD", quantidade: 1, precoUnitario: 200.00 }
      ],
      subtotal: 200.00,
      desconto: 0.00,
      total: 200.00,
      cupom: null,
      canceladoEm: null
    },
    {
      id: 6,
      usuarioId: 6,
      data: "2026-05-09T13:00:00Z",
      status: "ativo",
      itens: [
        { produtoId: 101, nome: "Cadeira Ergonômica", quantidade: 1, precoUnitario: 1200.00 }
      ],
      subtotal: 1200.00,
      desconto: 0.00,
      total: 1200.00,
      cupom: null,
      canceladoEm: null
    },
    {
      id: 7,
      usuarioId: 1,
      data: "2026-05-09T15:00:00Z",
      status: "ativo",
      itens: [
        { produtoId: 14, nome: "Suporte Monitor", quantidade: 1, precoUnitario: 120.00 }
      ],
      subtotal: 120.00,
      desconto: 0.00,
      total: 120.00,
      cupom: null,
      canceladoEm: null
    }
  ],
