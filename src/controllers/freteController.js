// Tabela de preços (simulados) por região
// Valores de frete fictícios por região. Em produção, viriam de contratos reais com cada transportadora.

const TABELA_FRETE = {
  sudeste: { sedex: 18.50, loggi: 45.00, jadlog: 9.90,  logtime: 12.00 },
  sul:     { sedex: 22.00, loggi: 55.00, jadlog: 11.00, logtime: 14.00 },
  nordeste:{ sedex: 32.00, loggi: 75.00, jadlog: 15.00, logtime: 20.00 },
  norte:   { sedex: 38.00, loggi: 90.00, jadlog: 18.00, logtime: 25.00 },
  centrooeste: { sedex: 28.00, loggi: 65.00, jadlog: 13.00, logtime: 17.00 },
};

const ESTADOS_REGIAO = {
  SP: 'sudeste', RJ: 'sudeste', MG: 'sudeste', ES: 'sudeste',
  PR: 'sul', SC: 'sul', RS: 'sul',
  BA: 'nordeste', SE: 'nordeste', AL: 'nordeste', PE: 'nordeste',
  PB: 'nordeste', RN: 'nordeste', CE: 'nordeste', PI: 'nordeste',
  MA: 'nordeste',
  PA: 'norte', AM: 'norte', RO: 'norte', RR: 'norte',
  AP: 'norte', AC: 'norte', TO: 'norte',
  MT: 'centro-oeste', MS: 'centro-oeste', GO: 'centro-oeste', DF: 'centro-oeste',
};

// Controller
export const calcularFrete = async (req, res) => {
  const { cep } = req.query;

  if (!cep) {
    return res.status(400).json({ erro: 'CEP é obrigatório.' });
  }

  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    return res.status(400).json({ erro: 'CEP inválido. Informe 8 dígitos.' });
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`); // API para identificar o estado
    const dados    = await resposta.json();

    if (dados.erro) {
      return res.status(404).json({ erro: 'CEP não encontrado.' });
    }

    const estado  = dados.uf;
    const regiao  = ESTADOS_REGIAO[estado] || 'sudeste';
    const precos  = TABELA_FRETE[regiao];

    return res.status(200).json({
      cep:    cepLimpo,
      estado: dados.uf,
      cidade: dados.localidade,
      regiao,
      opcoes: [
        { transportadora: 'Sedex',   prazo: '4 a 7 dias úteis',   preco: precos.sedex   },
        { transportadora: 'Loggi',   prazo: '2 a 3 dias úteis',   preco: precos.loggi   },
        { transportadora: 'JadLog',  prazo: '10 a 12 dias úteis', preco: precos.jadlog  },
        { transportadora: 'Logtime', prazo: '6 a 9 dias úteis',   preco: precos.logtime },
      ],
    });

  } catch (err) {
    console.error('Erro ao consultar ViaCEP:', err);
    return res.status(500).json({ erro: 'Erro ao calcular frete. Tente novamente.' });
  }
};