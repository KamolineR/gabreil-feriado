const express = require('express')
const {Sequelize, DataTypes, Op} = require('sequelize')

const app = express()
app.use(express.json())

//Conexão com banco de dados
const sequelize = new Sequelize('escola', 'root', 'escola', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

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

function toISO(d) {
    return new Date(d).toISOString().slice(0, 10); // garante YYYY-MM-DD
}

function validarDataISO(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    return toISO(new Date (data)) === data;
}

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