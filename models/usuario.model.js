const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'nombre es requerido']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es requerida']
    }
});

usuarioSchema.methods.toJSON = function () {

	//con esta opcion lo que hago es sacar algunas propiedades el objeto
	//y usamos el operador res(...) para unificarlos en uno solo y se llamara usuario
	const { __v, password, _id, ...usuario } = this.toObject();
    usuario._id = _id;
	return usuario;
}

module.exports = mongoose.model('Usuario', usuarioSchema);