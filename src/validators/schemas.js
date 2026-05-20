import { z } from 'zod';

// Auth
export const schemaRegistro = z.object({
    nome:  z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
    email: z.string().email('E-mail inválido.'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
});

export const schemaLogin = z.object({
    email: z.string().email('E-mail inválido.'),
    senha: z.string().min(1, 'Senha é obrigatória.'),
});

// Produtos
export const schemaCriarProduto = z.object({
    title:       z.string().min(2),
    description: z.string().optional(),
    price:       z.number().positive('Preço deve ser positivo.'),
    category:    z.string().optional(),
    stock:       z.number().int().min(0).default(0),
    image:       z.string().optional(),
    rating:      z.number().min(0).max(5).optional(),
    variations:  z.array(z.string()).optional(),
});

export const schemaEditarProduto = schemaCriarProduto.partial();

// Cupons
export const schemaCriarCupom = z.object({
    codigo:   z.string().min(3).toUpperCase(),
    desconto: z.number().positive(),
    tipo:     z.enum(['%', 'R$']),
    validade: z.string().optional(),
    ativo:    z.boolean().default(true),
});

// Lojas
export const schemaCriarLoja = z.object({
    nome:     z.string().min(2),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
    horario:  z.string().optional(),
    produtos: z.array(z.string()).optional(),
    estado:   z.string().length(2).optional(),
    ativa:    z.boolean().default(true),
});

// Checkout
export const schemaCheckout = z.object({
    cupom: z.string().optional(),
    endereco: z.object({
        rua:    z.string().min(3),
        numero: z.string().min(1),
        bairro: z.string().min(2),
        cidade: z.string().min(2),
        estado: z.string().length(2),
        cep:    z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido.'),
    }).optional(),
});

// Avaliações
export const schemaAvaliacao = z.object({
    nota:       z.number().int().min(1).max(5),
    comentario: z.string().min(3).optional(),
});

// Perfil
export const schemaEditarPerfil = z.object({
    nome:  z.string().min(2).optional(),
    senha: z.string().min(6).optional(),
}).refine((d) => d.nome || d.senha, {
    message: 'Informe ao menos nome ou senha.',
});