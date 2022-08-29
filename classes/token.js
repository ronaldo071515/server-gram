
const jwt = require('jsonwebtoken');

class Token {

    seed = 'estaESmiContraseñ@';
    caducidad = '30d';

    constructor() {}


    getJwtToken( payload ) {
        return new Promise( (resolve, reject) => {
            //firmar un nuevo token es jwt.sign()
            jwt.sign({usuario: payload}, this.seed, {
                expiresIn: '30d'
            }, ( err, token ) => {
                if ( err ) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve( token );
                }
            });
        });
    }

    comprobarToken( userToken ) {
        return new Promise( (resolve, reject) => {
            jwt.verify(userToken, this.seed, ( err, decoded ) => {
                if( err ) {
                    //No confiar
                    reject();
                } else {
                    //Token válido
                    resolve( decoded );
                }
            });
        });
    }

}


module.exports = Token;