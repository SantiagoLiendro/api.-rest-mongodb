import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema

const schemaUsuarios = new Schema({
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowarcase: true
    },
    telefono: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    favoritos: [{
        producto: {
            type: Schema.ObjectId,
            ref: 'Productos'
        }
    }],
    carrito: [{
        producto: {
            type: Schema.ObjectId,
            ref: 'Productos'
        },
        cantidad: {
            type: Number,
            trim: true
        }
    }],
    token: {
        type: String,
        default: null
    }

})

schemaUsuarios.pre('save', async function (next) {
    if (this.isModified(this.password)) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

schemaUsuarios.methods.comprobarPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}

const Usuarios = mongoose.model('Usuarios', schemaUsuarios);
export default Usuarios;