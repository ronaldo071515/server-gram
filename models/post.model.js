const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({

    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe de existir referencia a un usuario' ]
    }

});


postSchema.pre('save', function( next ) {
    this.created = new Date();
    next();
});

module.exports = mongoose.model('Post', postSchema);