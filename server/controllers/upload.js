const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
const path = require('path');
const fs = require('fs');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', async(req, res) => {
    try {

        let tipo = req.params.tipo;
        let id = req.params.id;
        let tiposValidos = ['producto', 'usuario'];
        let usuario;
        let producto;
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
        let img;
        if (tipo === 'usuario') {
            usuario = await getUsuario(id)
            .then(user => {
                img= '../uploads/'+tipo+'/'+user.img;
                return user;
            })
            .catch(error => {
                throw error;
            });
        }
        else if (tipo === 'producto') {
            producto = await getProducto(id)
            .then(p => {
                img= '../uploads/'+tipo+'/'+p.img;
                return p;
            })
            .catch(error => {
                throw error;
            });
        }

        await borrarImgenExistente(img);

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
                            err:{
                                message:error.message
                            }
                        })
                    });
            }

            if (tipo === 'producto') {
                producto.img = nombreArchivo;
                producto = await actualizarImagenProdcuto(producto)
                    .then(user => {
                        res.json({
                            ok: true,
                            producto,
                            message: "Archivo subido correctamente!!"
                        });
                    })
                    .catch(error => {
                        console.log('error: ', error);
                        return res.status(500).json({
                            ok: false,
                            err:{
                                message:error.message
                            }
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
        usuario = await Usuario.findByIdAndUpdate(usuario._id, usuario)
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
        throw err;
    }

}


async function getProducto(id) {
    try {
        let producto = await Producto.findById(id)
            .then(function(p) {
                if (!p) {
                    throw new Error('El producto no existe');
                } else {
                    return p;
                }
            })
            .catch(function(err) {
                throw err;
            });
        return producto;
    } catch (err) {
        throw err
    }
}


async function actualizarImagenProdcuto(producto) {
    try {
        producto = await Producto.findByIdAndUpdate(producto._id, producto)
            .then(function(p) {
                if (!p) {
                    throw new Error('No se pudo actualizar la imagen del producto');
                } else {
                    return p;
                }
            })
            .catch(function(err) {
                throw err;
            });
            console.log('producto:', producto);
        return producto;
    } catch (err) {
        throw err;
    }

}
function borrarImgenExistente(img){
    try{
        let pathImagen= path.resolve(__dirname,img);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }catch(err){
        throw err;
    }
   

}

module.exports = app;