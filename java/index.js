const express = require('express')
const app = express()
const bodyparser = require('bodyparser')
const connection = require('/models/database')

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso.')
    })
    .catch((MsgError) => {
        console.log(MsgError)
    })
    
app.listen(8080, () => {
    console.log('Rodando')
})