
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        require: true
    },

    AVC: {
        type: String,
        require: true,
        unique: true
    },

    cedula: {
        type: String,
        require: true
    },
    
    online:{
        type: Boolean,
        default: false
    },

});

UsuarioSchema.method('toJSON', function(){
    const { __v, _id, cedula, ...object}= this.toObject();
    object.uid = _id;
    return object
})

module.exports= model('Usuario', UsuarioSchema);