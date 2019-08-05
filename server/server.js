require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//habilitar carpeta public on los html
app.use(express.static(path.resolve(__dirname, '../public')));

//config global de rutas
app.use(require('./controllers/index'));


mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) {
        console.log('Error al conectarse a MongoDB: ', err);
    } else {
        console.log('base de datos online');
    }
});

mongoose.set('useFindAndModify', false);

app.listen(process.env.PORT, () => {
    console.log('escuchando en el puerto', process.env.PORT);
});