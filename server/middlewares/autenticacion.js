const   jwt = require('jsonwebtoken');


//verificar token

let verificaToken = (req, res, next) =>{

    let token = req.get('token');
    let SEED = process.env.KEY_API;
    jwt.verify(token, SEED, (err, decoded)  => {
        
        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    })
};


module.exports={
    verificaToken
}