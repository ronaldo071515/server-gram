const Token = require("../classes/token.js");

const token = new Token();

const verificaToken = async (req, res, next) => {

    const userToken = req.get('x-token') || '';

    token.comprobarToken( userToken )
        .then( decoded => {
            req.usuario = decoded.usuario;
            next();
        })
        .catch( err => {
            return res.json({
                ok: false,
                msg: 'Token Incorrecto'
            });
        });

}

module.exports = {
    verificaToken
};