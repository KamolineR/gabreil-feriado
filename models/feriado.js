const {DataTypes} = require('sequelize');
const sequelize = require('./index.js'); // importa a conexão

//Modelo(Tabelas)
const Feriado = sequelize.define('feriado', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
        validate: {is: /^\d{4}-\d{2}-\d{2}$/} //YYYY-MM-DD
    },
    nome:{
        type: DataTypes.STRING(255),
        allowNull: false,
        set(v) {this.setDataValue('nome', String(v || '').trim());}
    }
}, {tableName: 'feriado', timestamps: false})

module.exports = Feriado;
