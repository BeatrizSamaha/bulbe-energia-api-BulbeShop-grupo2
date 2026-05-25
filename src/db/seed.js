import bcrypt from 'bcryptjs';
import db from './conexao.js';

db.exec(`
  DELETE FROM favoritos;
  DELETE FROM carrinho_itens;
  DELETE FROM pedidos;
  DELETE FROM cupons;
  DELETE FROM produtos;
  DELETE FROM lojas;
  DELETE FROM categorias;
  DELETE FROM usuarios;
  DELETE FROM sqlite_sequence WHERE name IN (
    'favoritos','carrinho_itens','pedidos','cupons',
    'lojas','produtos','categorias','usuarios'
  );
`);


//  Usuários (senhas com hash bcrypt) 
const senhaHash = bcrypt.hashSync(process.env.SEED_PASSWORD || 'senha123', 10);

const inserirUsuario = db.prepare(`
  INSERT INTO usuarios (nome, email, senha, papel, pontos)
  VALUES (@nome, @email, @senha, @papel, @pontos)
`);

inserirUsuario.run({ nome: 'Beatriz Samaha',  email: 'beatriz.samaha@bulbeshop.com.br',  senha: senhaHash, papel: 'admin',   pontos: 10    });
inserirUsuario.run({ nome: 'Júlia Leal',      email: 'julia.leal@bulbeshop.com.br',      senha: senhaHash, papel: 'cliente', pontos: 10    });
inserirUsuario.run({ nome: 'Bruna Cruz',      email: 'bruna.cruz@bulbeshop.com.br',      senha: senhaHash, papel: 'admin',   pontos: 10    });
inserirUsuario.run({ nome: 'Pedro Paulucci',  email: 'pedro.paulucci@bulbeshop.com.br',  senha: senhaHash, papel: 'cliente', pontos: 10000 });
inserirUsuario.run({ nome: 'Tiago Heitzmann', email: 'tiago.heitzmann@bulbeshop.com.br', senha: senhaHash, papel: 'admin',   pontos: 10    });
inserirUsuario.run({ nome: 'Tiago Lage',      email: 'tiago.lage@bulbeshop.com.br',      senha: senhaHash, papel: 'cliente', pontos: 10    });

// Categorias
const inserirCategoria = db.prepare(`
  INSERT INTO categorias (nome, slug) VALUES (@nome, @slug)
`);

inserirCategoria.run({ nome: 'Economia de energia', slug: 'economia-de-energia' });
inserirCategoria.run({ nome: 'Eletrônicos',         slug: 'eletronicos'         });
inserirCategoria.run({ nome: 'Conforto',            slug: 'conforto'            });
inserirCategoria.run({ nome: 'Educação',            slug: 'educacao'            });

//  Lojas
const inserirLoja = db.prepare(`
  INSERT INTO lojas (nome, endereco, telefone, horario, produtos, estado, ativa)
  VALUES (@nome, @endereco, @telefone, @horario, @produtos, @estado, @ativa)
`);

inserirLoja.run({ nome: 'SolarTech Equipamentos', endereco: 'Av. Paulista, 1000 - São Paulo/SP',        telefone: '(11) 91234-5678', horario: 'Seg a Sex: 08h às 18h | Sáb: 08h às 13h', produtos: JSON.stringify(['Painéis solares', 'Inversores', 'Cabos fotovoltaicos']),              estado: 'SP', ativa: 1 });
inserirLoja.run({ nome: 'Eólica Sul Peças',        endereco: 'Rua das Araucárias, 42 - Porto Alegre/RS', telefone: '(51) 98765-4321', horario: 'Seg a Sex: 09h às 17h',                    produtos: JSON.stringify(['Turbinas eólicas', 'Geradores', 'Baterias']),                       estado: 'RS', ativa: 1 });
inserirLoja.run({ nome: 'Norte Baterias',          endereco: 'Rua do Comércio, 88 - Manaus/AM',          telefone: '(92) 93456-7890', horario: 'Seg a Sex: 08h às 17h | Sáb: 08h às 12h', produtos: JSON.stringify(['Baterias estacionárias', 'Nobreaks', 'Controladores de carga']), estado: 'AM', ativa: 0 });

//  Produtos
const inserirProduto = db.prepare(`
  INSERT INTO produtos (title, description, price, category, stock, image, rating, variations, loja_id, destaque)
  VALUES (@title, @description, @price, @category, @stock, @image, @rating, @variations, @loja_id, @destaque)
`);

inserirProduto.run({ title: 'Lâmpada LED 9W',              description: 'Lâmpada LED de alta eficiência energética, luz branca.',       price: 18.90,  category: 'Economia de energia', stock: 150, image: 'lampada-led-9w.jpg',                 rating: 4.5, variations: JSON.stringify(['Branca', 'Amarela', 'Neutra']),  loja_id: 1,    destaque: 1 });
inserirProduto.run({ title: 'Liquidificador Mondial 1000W', description: 'Liquidificador de alta potência, ideal para smoothies.',        price: 183.00, category: 'Eletrônicos',         stock: 30,  image: 'liquidificador-mundial-1000w.jpg',   rating: 4.7, variations: JSON.stringify(['Preto', 'Prata']),               loja_id: null, destaque: 1 });
inserirProduto.run({ title: 'Garrafa de água Tupperware',   description: 'Garrafa de água reutilizável, ideal para manter a hidratação.', price: 279.00, category: 'Conforto',            stock: 100, image: 'garrafa-tupperware.jpg',             rating: 4.3, variations: JSON.stringify(['500ml', '750ml', '1L']),         loja_id: null, destaque: 0 });
inserirProduto.run({ title: 'Ventilador de mesa Britânia',  description: 'Ventilador de mesa com 3 velocidades e oscilação.',            price: 279.00, category: 'Eletrônicos',         stock: 15,  image: 'ventilador-mesa-britania.jpg',       rating: 4.2, variations: JSON.stringify(['Branco', 'Cinza', 'Prata']),    loja_id: 2,    destaque: 0 });
inserirProduto.run({ title: 'Energia: Fique por dentro',    description: 'Livro sobre eficiência energética e energias renováveis.',     price: 45.90,  category: 'Educação',            stock: 60,  image: 'livro-energia-fique-por-dentro.jpg', rating: 4.0, variations: JSON.stringify(['Capa Dura', 'Brochura']),       loja_id: null, destaque: 1 });

// Cupons 
const inserirCupom = db.prepare(`
  INSERT INTO cupons (codigo, desconto, tipo, validade, ativo)
  VALUES (@codigo, @desconto, @tipo, @validade, @ativo)
`);

inserirCupom.run({ codigo: 'BEMVINDO10', desconto: 10, tipo: '%',  validade: '2026-12-31', ativo: 1 });
inserirCupom.run({ codigo: 'SOLAR20',    desconto: 20, tipo: '%',  validade: '2026-12-31', ativo: 1 });
inserirCupom.run({ codigo: 'EXPIRADO5',  desconto:  5, tipo: 'R$', validade: '2024-01-01', ativo: 0 });

// ── Pedidos ───────────────────────────────────────────────────────────────────
// Pedidos 
// Regra: se metodo_pagamento está preenchido → status deve ser 'concluido'
//        se metodo_pagamento é null           → status 'ativo' (aguardando pagamento)
//        se cancelado                         → status 'cancelado'
const inserirPedido = db.prepare(`
  INSERT INTO pedidos (usuario_id, data, status, metodo_pagamento, itens, subtotal, desconto, total, cupom, cancelado_em)
  VALUES (@usuario_id, @data, @status, @metodo_pagamento, @itens, @subtotal, @desconto, @total, @cupom, @cancelado_em)
`);

inserirPedido.run({ usuario_id: 1, data: '2026-05-01T10:00:00Z', status: 'concluido', metodo_pagamento: 'cartao_credito', itens: JSON.stringify([{ produtoId: 1, title: 'Lâmpada LED 9W',              quantidade: 2, price: 18.90  }]),                                                                                              subtotal: 37.80,  desconto: 0,    total: 37.80,  cupom: null,        cancelado_em: null                   });
inserirPedido.run({ usuario_id: 2, data: '2026-05-03T15:30:00Z', status: 'concluido', metodo_pagamento: 'pix',            itens: JSON.stringify([{ produtoId: 2, title: 'Liquidificador Mondial 1000W', quantidade: 1, price: 183.00 }, { produtoId: 1, title: 'Lâmpada LED 9W', quantidade: 3, price: 18.90 }]), subtotal: 239.70, desconto: 0,    total: 239.70, cupom: null,        cancelado_em: null                   });
inserirPedido.run({ usuario_id: 3, data: '2026-05-05T09:15:00Z', status: 'cancelado', metodo_pagamento: null,             itens: JSON.stringify([{ produtoId: 4, title: 'Ventilador de mesa Britânia',  quantidade: 1, price: 279.00 }]),                                                                                              subtotal: 279.00, desconto: 0,    total: 279.00, cupom: null,        cancelado_em: '2026-05-05T10:00:00Z' });
inserirPedido.run({ usuario_id: 4, data: '2026-05-07T18:45:00Z', status: 'ativo',     metodo_pagamento: null,             itens: JSON.stringify([{ produtoId: 5, title: 'Energia: Fique por dentro',    quantidade: 1, price: 45.90  }]),                                                                                              subtotal: 45.90,  desconto: 4.59, total: 41.31,  cupom: 'BEMVINDO10', cancelado_em: null                   });
inserirPedido.run({ usuario_id: 5, data: '2026-05-08T11:20:00Z', status: 'concluido', metodo_pagamento: 'pix',            itens: JSON.stringify([{ produtoId: 3, title: 'Garrafa de água Tupperware',   quantidade: 1, price: 279.00 }]),                                                                                              subtotal: 279.00, desconto: 0,    total: 279.00, cupom: null,        cancelado_em: null                   });
inserirPedido.run({ usuario_id: 6, data: '2026-05-09T13:00:00Z', status: 'concluido', metodo_pagamento: 'cartao_credito', itens: JSON.stringify([{ produtoId: 2, title: 'Liquidificador Mondial 1000W', quantidade: 1, price: 183.00 }]),                                                                                              subtotal: 183.00, desconto: 0,    total: 183.00, cupom: null,        cancelado_em: null                   });
inserirPedido.run({ usuario_id: 1, data: '2026-05-10T15:00:00Z', status: 'ativo',     metodo_pagamento: null,             itens: JSON.stringify([{ produtoId: 1, title: 'Lâmpada LED 9W',              quantidade: 5, price: 18.90  }]),                                                                                              subtotal: 94.50,  desconto: 0,    total: 94.50,  cupom: null,        cancelado_em: null                   });

console.log('Seed concluído: banco populado com sucesso.');

db.close();