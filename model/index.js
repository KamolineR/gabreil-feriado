const {Sequelize} = require('sequelize')
//conexão com BANCO DE DADOS
const sequelize = new Sequelize('apiFeriados', 'root', 'SUASENHA',{
    host:'localhost',
    dialect: 'mysql',
    logging: false
})
module.exports = sequelize;