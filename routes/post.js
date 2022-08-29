const { Router } = require('express');

const FileSystem = require('../classes/file-system.js');

const { verificaToken } = require('../middlewares/autenticacion.js');
const Post = require('../models/post.model.js');

const fileSytem = new FileSystem();

const postRoutes = Router();

postRoutes.get('/post', async (req, res) => {

    try {
        //const posts = await Post.find().sort({ _id: -1 }).limit(10);
        //const { limite = 5, pagina = 0 } = req.query;.skip( Number(pagina) )
        let { pagina = 1 } = req.query;

        const [total, posts] = await Promise.all([
            Post.countDocuments(),
            Post.find()
                .sort({ _id: -1 })
                .skip( (Number( pagina ) -1 ) * 10 )             
                .limit( 10 )
                .populate({path: 'usuario'})
        ]);
        
        return res.json({
            ok: true,
            total,
            pagina,
            posts
        });

    } catch (error) {
        return res.json({
            ok: false
        });
    }


});


/* Crear POST */
postRoutes.post('/post', [ verificaToken ], async (req, res) => {

    const body = req.body;
    body.usuario = req.usuario._id;/* el id del usuario lo traigo del token<- */

    const imagenes = fileSytem.imagenesDeTempHaciaPost( req.usuario._id );

    body.img = imagenes;

    try {
        
        const post = new Post( body );
        const postDB = await post.save().then(t => t.populate('usuario'));

        return res.json({
            ok: true,
            post: postDB
        });

    } catch (error) {
        return res.json({
            ok: false
        });
    }


});

/* Ruta para subir archivos */
postRoutes.post('/post/upload', [ verificaToken ], async( req, res ) => {

    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subio ningún archivo'
        });
    }
    
    const { image } = req.files;
    
    if( !image ) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subio ningún archivo -image'
        });
    }
    
    if( !image.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una imagen!'
        });
    }

    await fileSytem.guardarImagenTemporal( image, req.usuario._id );
    
    return res.json({
        ok: true,
        file: image.mimetype
    });

});


postRoutes.get('/imagen/:userid/:img', async( req, res ) => {

    const { userid, img } = req.params;

    const pathFoto = fileSytem.getFotoUrl( userid, img );

    res.sendFile( pathFoto );

});


module.exports =  postRoutes;