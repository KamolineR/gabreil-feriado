const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./config/database');
const user = require('./models/user');
const bcrypt = require('bcrypt');
const denuncia = require('./models/denuncia');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection.authenticate()
    .then(() => {
        console.log('Conexão com banco de dados bem sucedida');
        return connection.sync();
    })
    .catch(err => {
        console.error('Erro ao tentar conectar o banco de dados', err);
    });

app.post('/user', async (req, res) => {
    try {
        const { nome, sobrenome, email, senha } = req.body;
        const senhaHash = await bcrypt.hash(senha, 10)
        const novoUsuario = await user.create({ nome, sobrenome, email, senha: senhaHash });
        res.status(201).json(novoUsuario);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({ erro: 'Email já cadastrado'});

        }
        console.error(err);
        res.status(500).json({ erro: 'Erro ao criar usuario' });
    }   
});

app.get('/users', async (req, res) => {
    try {
        const usuarios = await user.findAll();
        res.json(usuarios);
    } catch (err) {
        res.status (500).json({ erro: 'Erro ao buscar usuarios'});
    }
});


app.post('/denuncias', async (req, res) => {
    try {
        const { descricao, data, endereco } = req.body;
        const novaDenuncia = await denuncia.create({ descricao, data, endereco});
        res.status(201).json(novaDenuncia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar denúncia' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});