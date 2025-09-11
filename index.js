const express = require('express')
const fs = require('fs') // leitura de arquivo
const app = express()

const feriados = JSON.parse(fs.readFileSync('./feriado.json', 'utf-8'));
app.use(express.json()); // permite ler JSON no body (POST/PUT)
const DATA_FILE = './feriados.json';

function toISO(d) {
    return new Date(d).toISOString().slice(0, 10); // garante YYYY-MM-DD
}

function persistir() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(feriados, null, 2), 'utf-8');
}

function validarDataISO(data) {
    // aceita apenas YYYY-MM-DD e checa se a data é válida no calendário
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const dt = new Date(data);
    return toISO(dt) === data; // normalização idêntica => data válida
}

// 1. listar todos os feriados

app.get('/feriados', (req, res) =>{
    res.json(feriados)
})

// 2. buscar feriado por nome -> /feriado/nome/Nataç

app.get('/feriado/nome/:nome', (req, res) =>{
    const nome = (req.params.nome || '').toLowerCase();
    const resultado = feriados.find( f => f.nome.toLowerCase().includes(nome));
    resultado ? res.json(resultado) : res.status(404).json({erro: "Feriado não encontrado"})
})
/*
Operador ternário.

condição ? valorSeVerdadeiro : valorSeFalso;
*/
// 3. calcular a data para o prox feriado
app.get('/feriado/proximo', (req, res)=>{
    const hoje = new Date();
    const proximos = feriados
        .map(f=>({...f, dias: Math.ceil(new Date(f.data) - hoje) / 1000*60*60*24 }))
        .filter(f => f.dias >= 0)
        .sort((a,b) => a.dias - b.dias)
    proximos.length >0 ? res.json(proximos[0]) : res.json({mensagem: "Nenhum feriado futuro"})
})

// 4. Cadastrar um novo feriado
app.post('/cadastroFeriado', (req, res)=>{
    const{data, nome} = req.body || {}

    if(!data || !nome){
        return res.status(400).json({erro: "Data Inválida. Use o formato YYYY-MM-DD"})
    }
    const iso = toIso(data);
    if(!validarDataISO(iso)){
        return res.status(400).json({erro: "Data inválida. Use o formato YYYY-MM-DD"})
    }
    //Some - é usado para arrays e serve para verificar se um elemento do array satisfaz uma condição
    const jaExiste = feriados.some(f => f.data === iso);
    if(jaExiste){
        return res.status(400).json({erro: "Ja existe feriado nessa data"})
    }
    const novo = {data:iso, nome:String(nome).trim()};
    feriados.push(novo);
    feriados.sort((a,b) => new Date(a.data) - new Date(b.data))
    persistir()
    return res.status(201).json(novo)

})


app.listen(3000, ()=>console.log("rodandoooooo......."))