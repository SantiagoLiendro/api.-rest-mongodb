import { text } from "express";
import mongoose from "mongoose";

const Schema = mongoose.Schema

const schemaProductos = new Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: 'Usuarios'
    },
    titulo: {
        type: String
    },
    precio: {
        type: Number,
        trim: true
    },
    cantidad: {
        type: Number,
        trim: true
    },
    descripcion: {
        type: String
    },
    imagen: {
        type: String
    },
    categoria: {
        type: Schema.ObjectId,
        ref: 'Categorias'
    },
    disponible: {
        type: Boolean,
        default: true
    }
})
schemaProductos.index({ titulo: 'text' })

const Productos = mongoose.model('Productos', schemaProductos)
export default Productos;