require('./config/config')
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./controllers/usuario'));


mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) {
        throw new Error(err);
    }
    console.log('base de datos online')
});

mongoose.set('useFindAndModify', false);

app.listen(process.env.PORT, () => {
    console.log('escuchando en el puerto', process.env.PORT);
});