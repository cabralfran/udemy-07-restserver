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
        let usuario = await getUsuario(id)
            .then(user => {
                return user;
            })
            .catch(error => {
                throw error;
            });

        let nombreArchivo = id + '-' + new Date().getMilliseconds() + '.' + extensionArchivo;

        file.mv(path.resolve(__dirname, '../uploads/' + tipo + '/' + nombreArchivo), async(err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (tipo === 'usuario') {
                usuario.img = nombreArchivo;
                usuario = await actualizarImagenUsuario(usuario)
                    .then(user => {
                        res.json({
                            ok: true,
                            usuario,
                            message: "Archivo subido correctamente!!"
                        });
                    })
                    .catch(error => {
                        return res.status(500).json({
                            ok: false,
                            err: error
                        })
                    });
            }
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err: {
                message: err.message
            }
        })
    }

});


async function getUsuario(id) {
    try {
        let usuario = await Usuario.findById(id)
            .then(function(user) {
                if (!user) {
                    throw new Error('El usuario no existe');
                } else {
                    return user;
                }
            })
            .catch(function(err) {
                throw err;
            });
        return usuario;
    } catch (err) {
        throw err
    }
}

async function actualizarImagenUsuario(usuario) {
    try {
        usuario = await Usuario.findByIdAndUpdate('usuario._id', usuario)
            .then(function(user) {
                if (!user) {
                    throw new Error('No se pudo actualizar la imagen del usuario');
                } else {
                    return user;
                }
            })
            .catch(function(err) {
                throw err;
            });
        return usuario;
    } catch (err) {
        console.log('ERRORRRRRRRRRRRRR');
        throw err;
    }

}


module.exports = app;