const express = require('express')
const fs = require('fs') // leitura de arquivo
const app = express()

const feriados = JSON.parse(fs.readFileSync('./feriado.json', 'utf-8'));

// 1. listar todos os feriados

app.get('/feriados', (req, res) =>{
    res.json(feriados)
})

app.listen(3000, ()=>console.log("rodandoooooo......."))