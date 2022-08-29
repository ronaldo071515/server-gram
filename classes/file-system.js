const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FileSystem {

    constructor() {
    }

    guardarImagenTemporal( file, userId ) {

        return new Promise( (resolve, reject ) => {
            //crea carpeta
            const path = this.crearCarpetaUser( userId );
            //nombre archivo
            const nombreArchivo = this.generarNombreUnico( file.name );
            //Mover el archivo del temp  a nuestra carpeta
            file.mv(`${ path }/${ nombreArchivo }`, (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
            });
        });

    }

    generarNombreUnico(nombre0riginal) {

        const nombreArr = nombre0riginal.split('.');
	    const extension = nombreArr[ nombreArr.length - 1 ];
        
        const nombreUnico = uuidv4() + '.' + extension;
        
        return nombreUnico;

    }

    crearCarpetaUser( userId ) {

        //const {pathname: root} = new URL('../src', import.meta.url);
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathTem = pathUser + '/temp';
        //console.log(pathUser);
        //console.log(pathTem);

        const existe = fs.existsSync( pathUser );

        if( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathTem );
        }

        return pathTem;

    }

    imagenesDeTempHaciaPost( userId ) {
        
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if( !fs.existsSync( pathTemp ) ) {
            return [];
        }
        
        if( !fs.existsSync( pathPost ) ) {
            fs.mkdirSync( pathPost ); 
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

        imagenesTemp.forEach( imagen => {
            fs.renameSync(`${ pathTemp }/${ imagen }`, `${ pathPost }/${ imagen }`);
        });

        return imagenesTemp

    }

    obtenerImagenesEnTemp( userId ) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync( pathTemp ) || [];

    }

    /* Obtengo la foto */
    getFotoUrl( userId, img ) {

        //crear path Postd
        const pathFoto = path.resolve(__dirname, '../uploads/', userId, 'posts', img);

        if( !fs.existsSync( pathFoto ) ) {
            return path.join(__dirname, '../assets/no-image.jpg');
        }

        return pathFoto;

    }

}

module.exports = FileSystem;