const express = require('express');


class Server {
     
    app = express();
    port =  process.env.PORT || 3000;

    constructor() {
        this.app = express();
    }


    start() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en: ', this.port);
        })
    }

}

module.exports = Server