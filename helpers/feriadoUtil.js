const {Op} = require('sequelize');

function toISO(d) {
    return new Date(d).toISOString().slice(0, 10); // garante YYYY-MM-DD
}

function validarDataISO(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    return toISO(new Date (data)) === data;
}

async function buscarFeriadoPorData(model, data){
    return model.findOne({ where: {data} });
}