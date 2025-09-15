const Sequelize = require ('sequelize')
const connection = new Sequelize('PVO','root','',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
module.exports = connection;