const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    //res.send('get usuario'); // html
    //  res.json('Hola mundo'); // json

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ /*google: true*/ }, 'nombre email role estado google img' /* digo que campos quiero retornar */ )
        .skip(desde) // salta los primeros registros y muestra los que le sigue a partir del desde
        .limit(limite) // para paginar le pone un limite de datos a retornar
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ /*google: true*/ }, (err, cantidad) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            });

        });
});

app.get('/usuario/activo', verificaToken, (req, res) => {
    //res.send('get usuario'); // html
    //  res.json('Hola mundo'); // json

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img' /* digo que campos quiero retornar */ )
        .skip(desde) // salta los primeros registros y muestra los que le sigue a partir del desde
        .limit(limite) // para paginar le pone un limite de datos a retornar
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, cantidad) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad
                })
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
});

app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // solo deja los valores que se desean actualizar enviados en el body

    Usuario.findByIdAndUpdate(id, body, { new: true /* retorna el dato actualizado*/ , runValidators: true /* para las valid del squema*/ }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })

    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })

    });



});


app.delete('/usuario/estado/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;
    let estado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario no encontrado' }
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })

    });



});

module.exports = app;