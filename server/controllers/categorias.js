const express = require('express');
const _ = require('underscore');


const Categoria = require('../models/categoria');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            console.log('test');
            res.json({
                ok: true,
                categorias
            });

        });
        console.log('test');
});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró una categoria con el id enviado'
                }
            });
        }
<<<<<<< HEAD
        console.log('test2');
=======
        console.log('test1');
>>>>>>> 0113d8b7eb60136b9774e3787798be94f3582a03
        res.json({
            ok: true,
            categoria
        })
    });
<<<<<<< HEAD
    console.log('test2');
    console.log('test2');
});

app.post('/categoria', verificaToken, (req, res) => {
    console.log('test2');
    console.log('test2');
=======
    console.log('test1');
});

app.post('/categoria', verificaToken, (req, res) => {
    console.log('test1');
>>>>>>> 0113d8b7eb60136b9774e3787798be94f3582a03
    let body = req.body;

    if (!body.nombre) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El nombre es obligatorio"
            }
        });
    }
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se creo la categoria: ' + err
                }
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDb
        })

    });
});



app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let categoriaNombre = { nombre: body.nombre };
    console.log("categoriaNombre", categoriaNombre);
    Categoria.findByIdAndUpdate(id, categoriaNombre, { new: true, runValidators: true }, (err, categoriaDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }

        res.json({
            ok: true,
            categoriaDb
        });
    });


});


app.delete('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDb) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrada' }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada exitosamente'
        });
    });


});








module.exports = app;