const mongoose = require('mongoose');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const Server = require('./classes/server.js');

const userRoutes = require('./routes/usuario.js');
const postRoutes = require('./routes/post.js');

//console.log('ygqKsOEAEo8DAW0B');

const server = new Server();

/* Cors */
server.app.use( cors() );

//middleware
/* Leer el body */
server.app.use( express.json() );

server.app.use( fileUpload( { useTempFiles: true } ) );

//Rutas de mi app
server.app.use('/api', userRoutes);
server.app.use('/api', postRoutes);


//Conectar DB
const conectarDB = async() => {
    const uri = 'mongodb+srv://ronaldo:ygqKsOEAEo8DAW0B@cluster0.fkkit.mongodb.net/fotosgram';
    try {
        const db = await mongoose.connect(uri);
        const url = `${ db.connection.host }:${ db.connection.port }`;
        console.log(`MongoDB conectado en: ${ url }`);
    } catch (error) {
        console.log(`Error: ${ error }`);
        process.exit(1);//Imprime el error
    }
}
conectarDB();

server.start();
