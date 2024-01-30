import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schemaCategorias = new Schema({
    nombre: {
        type: String,
        trim: true
    }
})

const Categorias = mongoose.model('Categorias', schemaCategorias)
export default Categorias;