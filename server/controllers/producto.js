const express = require('express');
const _ = require('underscore');


const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


// obtener todos /productos trae todo los productos propulando el usuario y ategoria, paginado


app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);
    Producto.find({})
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, cantidad) => {

                res.json({
                    ok: true,
                    productos,
                    cantidad
                })

            });
        });

});

// obtener un producto por id /productos/:id populate

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {

            if (err) {
                return res.json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se econtro un producto con el id enviado: " + id
                    }
                })
            }

            res.json({
                ok: true,
                producto
            })
        });

});

// crear un producto  // grabar el usaurio y la categoria

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.precioUni = body.precioUni;
    producto.descripcion = body.descripcion;
    producto.disponible = body.disponible;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;

    producto.save({ runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se creo el usuario",
                    err
                }
            });
        }

        res.status(2001).json({
            ok: true,
            producto: productoDB
        });

    });

});

// actualizar producto 

app.put('/productos/:id', verificaToken, (req, res) => {

    let body = req.body;
    let id = req.params.id;

    let fields = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        producto: usuario = req.usuario._id
    }

    Producto.findByIdAndUpdate(id, fields, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un producto con el id enviado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// borrar producto 

app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro un producto con el id enviado',
                    err
                }
            });
        }

        res.json({
            ok: true,
            message: "El producto se ha eliminado correctamente"
        });
    });
});

app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let er = new RegExp(termino, 'i');

    Producto.find({ nombre: er }, (err, productos) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        })

    });

});



module.exports = app;