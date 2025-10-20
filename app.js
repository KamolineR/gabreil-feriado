const express = require('express')
const {Sequelize, DataTypes, Op} = require('sequelize')

const app = express()
app.use(express.json())

//Criação das rotas

//criar a rota GET - listar todos os feriados (select *)

app.get('/feriado', async (req, res)=>{
    const feriados =  await Feriado.findAll({order: [['data', 'ASC']]});
    res.json({feriados})
});

/* 
DESAFIOO
CRIAR UMA ROTA GET, 
BUSCAR FERIADO PELO NOME
*/

app.get('/feriado', async(req, res)=>{
    const feriados = await Feriado.findAll({
        where: {
            nome: 'name'
        }
    });
});

app.post("/cadastriFeriado", async (req, res)=>{
    const {data, nome} = req.body || {};
    if (!data || !nome) return res.status(400).json({erro: 'Informe data (YYYY-MM-DD) e nome'})

    const iso = toISO(data);
    if (!validarDataISO(iso)) return res.status(400).json({ erro: 'Data inválida. Use YYYY-MM-DD'});

    try {
        const novo = await Feriado.create({ data: iso, nome: String(nome).trim() });
        res.status(201).json(novo);
    } catch (e) {
        if (String(e).includes('ER_DUP_ENTRY')) {
            return res.status(409).json({ erro: 'Já existe feriado nessa data' });
        }
        res.status(500).json({ erro: 'Falha ao cadastrar', detalhe: String(e)});
    }
});


const path = require('patch')

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'feriado.html'))
})
app.use(express.static(__dirname))

// inicialização
(async()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync() //criar a tabela se não existir
        app.listen(3000, ()=>console.log('Rodando'))
    }catch(e){
        console.log('Erro ao iniciar', e);
        process.exit(1);
    }
})