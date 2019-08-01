const jwt = require('jsonwebtoken');


//verificar token

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    let SEED = process.env.KEY_API;
    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
};



let verificaAdminRol = (req, res, next) => {

    if (req.usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            err: "El usuario no posee el rol de Admin"
        });
    }
}


module.exports = {
    verificaToken,
    verificaAdminRol
}