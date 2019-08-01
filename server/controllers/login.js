const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(401).json({
                ok: false,
                err: 'El usuario o la contraseña son incorrectos'
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(401).json({
                ok: false,
                err: 'El usuario o la contraseña son incorrectos'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.KEY_API, { expiresIn: process.env.CADUCIDAD_TOKEN }); // ss * mm * hh * dd
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

});


//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //si se encontro el usuario
        if (usuarioDB) {
            if (usuarioDB.google === false) { // se valida que no sea google, si no es google se tiene que logear de forma normal
                return res.status(400).json({
                    ok: false,
                    err: {
                        messsage: "El usuario debe de ser autenticado de forma normal"
                    }
                });
            } else { // es google se retorna el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.KEY_API, { expiresIn: process.env.CADUCIDAD_TOKEN }); // ss * mm * hh * dd
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else { // el usuario no existe y se valido bien por goole, se procede a crear el usuario y a retonar el token
            let nuevoUser = new Usuario();

            nuevoUser.nombre = googleUser.nombre;
            nuevoUser.email = googleUser.email;
            nuevoUser.google = true;
            nuevoUser.img = googleUser.img;
            nuevoUser.password = "SARASA";

            Usuario.create(nuevoUser, (err, nuevoUser) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.KEY_API, { expiresIn: process.env.CADUCIDAD_TOKEN }); // ss * mm * hh * dd

                res.json({
                    ok: true,
                    usuario: nuevoUser,
                    token
                })

            });

        }

    });




});



module.exports = app;