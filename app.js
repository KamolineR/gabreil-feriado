const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./model/index.js')
const feriadoRoutes = require('./routes/index.js')
const app = express();
app.use(express.json());
app.use('/feriado', feriadoRoutes)
/*
http:localhost:3000/feriado/listarFeriados
*/
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'frontend.html'))
})
app.use(express.static(__dirname))
//start
async function startServer(){
    try{
        await sequelize.authenticate();
        await sequelize.sync() //criar a tabela se nao existir
        console.log("Banco de dados conectado com sucesso");
        app.listen(3000,()=>console.log("Rodando na porta 3000."))
    }catch(e){
        console.error('Erro ao iniciar ', e.message);
        process.exit(1);
    }
}
startServer()

