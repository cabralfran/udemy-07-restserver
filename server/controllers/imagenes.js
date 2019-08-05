const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const path = require('path');
const fs = require('fs');

const app = express();


// default options
app.use(fileUpload());

app.get('/imagen/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname,'../uploads/'+tipo+'/'+img);
    let pathNoFound = path.resolve(__dirname, '../assets/notfound.png');

    let pathImagen= path.resolve(__dirname,pathImage);
    if(!fs.existsSync(pathImagen)){
        res.sendFile(pathNoFound);
    }
    else{
        res.sendFile(pathImagen);
    }


    

});

module.exports = app;