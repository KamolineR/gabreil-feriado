const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');
const Feriado = require('../model/Feriados.js');
const {
    toISO,
    validarDataISO,
    buscarFeriadoPorData,
    buscarFeriadoPorNome
} = require('../helpers/feriadoUtils.js')

//MiddleWare é um meio termo CLIENTE - MIDDLEWARE1 - MIDDLEWARE2 - SERVIDOR

function validarDataParams(req, res, next){
  const data = toISO(req.params.data);
  if(!validarDataISO(data)){
    return res.status(400).json({erro: 'Data inválida, use o formato YYYY-MM-DD'})
  }
  req.validarDataISO = data;
  next();
}

//Rota GET- para mostrar todos os feriados - select * from
router.get('/listarFeriados', async (req, res) =>{
    const feriados = await Feriado.findAll({order:[['data', 'ASC']]});
    res.json({feriados});
})
//Buscar por nome(contém)
router.get('/nome/:nome', async (req, res)=>{
    const nome = (req.params.nome || '').trim();
    if(!nome) return res.status(400).json({erro: 'Informe um nome'});
    try{
      const feriado = await buscarFeriadoPorNome(Feriado, nome);
      if(feriado.length > 0){
        res.json(feriado);
      }else{
        res.status(404).json({erro: 'Feriado não encontrado'});
      }
    }catch(e){
      res.status(500).json({erro: 'Erro interno ao buscar feriado', detalhe: String(e)});
    }
});
//Prox feriado
router.get('/feriado/proximo', async (req, res)=>{
    const hoje = toISO(new Date());
    const proximo = await Feriado.findOne({
        where: {data: {[Op.gte]: hoje}},
        order: [['data', 'ASC']]
    });
    if(!proximo) return res.json({mensagem: 'Nenhum feriado futuro'});
    const dias = Math.ceil((new Date(proximo.data) - new Date()) / (1000 * 60 * 60 * 24))
    res.json({...proximo.toJSON(), dias})
});
//Rota POST
router.post('/cadastroFeriado', async (req, res)=>{
    const {data, nome} = req.body || {};
    if(!data || !nome){
        return res.status(400).json({erro: "Data inválida. Use o formato YYYY-MM-DD e Nome."})
    }
    const iso = toISO(data);
    if(!validarDataISO(iso)){
        return res.status(400).json({erro: "Data inválida. Use o formato YYYY-MM-DD"})
    }
    try{
        const novo = await Feriado.create({data: iso, nome: String(nome).trim()})
        res.status(201).json(novo)
    }catch(e){
        if(String(e).includes('ER_DUP_ENTRY')){
            return res.status(409).json({erro: 'Já existe feriado nessa data'})
        }
        res.status(500).json({erro:'Falha ao cadastrar', detalhe: String(e)});     
    }
})
// 5) Atualizar (busca pela data da URL)
router.put('/feriado/:data', async (req, res) => {
  const dataAlvo = toISO(req.params.data);
  if (!validarDataISO(dataAlvo)) {
    return res.status(400).json({ erro: 'Data inválida na URL. Use YYYY-MM-DD' });
  }
  const feriado = await buscarFeriadoPorData(Feriado, dataAlvo);
  if (!feriado) return res.status(404).json({ erro: 'Feriado não encontrado para a data informada' });
  const { nome, data } = req.body || {};
  if (nome !== undefined) feriado.nome = String(nome).trim();
  if (data !== undefined) {
    const nova = toISO(data);
    if (!validarDataISO(nova)) return res.status(400).json({ erro: 'Nova data inválida. Use YYYY-MM-DD' });
    // se tentar duplicar data existente, MySQL bloqueará; tratamos o erro abaixo
    feriado.data = nova;
  }
  try {
    await feriado.save();
    res.json(feriado);
  } catch (e) {
    if (String(e).includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ erro: 'Já existe feriado nesta data' });
    }
    res.status(500).json({ erro: 'Falha ao atualizar', detalhe: String(e) });
  }
});
// 6) Deletar (pela data)
router.delete('/feriado/:data', async (req, res) => {
  const dataAlvo = toISO(req.params.data);
  if (!validarDataISO(dataAlvo)) {
    return res.status(400).json({ erro: 'Data inválida. Use YYYY-MM-DD' });
  }
  const feriado = await buscarFeriadoPorData(Feriado, dataAlvo);
  if (!feriado) return res.status(404).json({ erro: 'Feriado não encontrado para a data informada' });
  await feriado.destroy();
  res.status(200).json({ removido: feriado });
});
module.exports = router;