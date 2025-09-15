const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const denuncia = connection.define('denuncia', {
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'denuncias',
    timestamps: false
});

denuncia.sync();

module.exports = denuncia;
