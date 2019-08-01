const express = require('express');
const _ = require('underscore');


const Categoria = require('../models/categoria');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}).exec((err, categorias) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });

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

        res.json({
            categoria
        })
    });

});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    if (!body.nombre) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El nombre es obligatorio"
            }
        });
    }
    console.log(req);
    let categoria = new Categoria({
        nombre: body.nombre,
        usuarioId: req.usuario._id
    });

    categoria.save((err, categoriaDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
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
            categoriaDb
        });
    });


});








module.exports = app;