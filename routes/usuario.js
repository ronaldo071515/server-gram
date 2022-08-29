const { Router } = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario.model.js');
const Token = require('../classes/token.js');
const { verificaToken } = require('../middlewares/autenticacion.js');

const userRoutes = Router();

const generJWT = new Token();

/* Login */
userRoutes.post('/login', async( req, res ) => {

    const { email, password } = req.body;
    
    try {
        const userDB = await Usuario.findOne({ email });
        if( !userDB ) {
            return res.json({
                msg: 'Usuario / Contraseña no son correctos'
            });
        }

        const validPassword = bcrypt.compareSync( password, userDB.password );
		if ( !validPassword ) {
			return res.json({
				msg: 'Usuario / Contraseña no son correctos'
			});
		}

        /* Token */
        const tokenUser = await generJWT.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        return res.json({
            ok: true,
            token: tokenUser
        });
        
    } catch (error) {
        return res.json({
            ok: false,
            error
        });   
    }

});

/* Crear un usuario */
userRoutes.post('/create', async ( req, res ) => {
    const { nombre, password, email, avatar } = req.body;
    try {
        const user = new Usuario({
            nombre,
            password,
            email,
            avatar
        });
        const existe = await Usuario.findOne({ email: email });
        if( existe ) {
            return res.json({
                msg: `Ya existe el usuario con e-mail: ${ email }`
            });
        }

        const salt = bcrypt.genSaltSync();
	    user.password = bcrypt.hashSync( password, salt);

        const userDB = await user.save();
        
        const tokenUser = await generJWT.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        return res.json({
            ok: true,
            token: tokenUser
        });
        
    } catch (error) {
        return res.json({
            ok: false,
            error
        });
    }


});

/* Actualizar usuario */
userRoutes.post('/update', verificaToken , async ( req, res ) => {

    const { ...user } = req.body;
    try {
        
        const userDB = await Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true } );

        const tokenUser = await generJWT.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        return res.json({
            ok: true,
            token: tokenUser
        });
        
    } catch (error) {
        return res.json({
            ok: false,
            error
        });
    }


});


userRoutes.get('/user', [verificaToken], async( req, res ) => {

    const usuario = req.usuario;

    return res.json({
        ok: true,
        usuario
    });

});


module.exports =  userRoutes;