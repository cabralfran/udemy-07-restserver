const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const app = express();
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', async(req, res) => {
    try {

        let tipo = req.params.tipo;
        let id = req.params.id;
        let tiposValidos = ['producto', 'usuario'];
        if (!tipo) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Falta espeficiar el tipo del archivo"
                }
            });
        } else if (tiposValidos.indexOf(tipo.trim()) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Solo se permiten archivos del tipo: " + tiposValidos.join(', ')
                }
            });
        }

        if (!id) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Falta espeficiar el id del dato"
                }
            });
        }

        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
        }
        let file = req.files.archivo;
        let extensionArchivo = file.name.split('.');
        extensionArchivo = extensionArchivo[extensionArchivo.length - 1];
        let extensionesPermitidas = ['png', 'jpg', 'gif', 'jepg'];

        if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Solo se permiten archivos con las siguientes extensiones: ' + extensionesPermitidas.join(', ')
                }
            });
        }

        let usuario = await getUsuario(idUser, res);

        let nombreArchivo = id + '-' + new Date().getMilliseconds() + '.' + extensionArchivo;
        file.mv(path.resolve(__dirname, '../uploads/' + tipo + '/' + nombreArchivo), async(err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (tipo === 'usuario') {
                await actualizarImagenUsuario(usuario);
                res.json({
                    ok: true,
                    message: "Archivo subido correctamente!!"
                });
            }
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }

});


function getUsuario(idUser) {

    Usuario.findById(idUsuario, (err, usuarioDB) => {
        if (err) {
            throw err;
        }

        if (!usuarioDB) {
            console.log('asd');
            throw new Error('No existe el usuario')
        }

        return usuarioDB;
    });

}

function actualizarImagenUsuario(usuario) {

    usuario.img = nombreArchivo;

    usuario.save((err, usuarioDB) => {

        if (err) {
            throw err
        }

    });

}


module.exports = app;