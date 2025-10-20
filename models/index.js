const {Sequelize} = require('sequelize')

//Conexão com banco de dados
const sequelize = new Sequelize('escola', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;