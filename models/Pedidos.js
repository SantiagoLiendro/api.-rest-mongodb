import mongoose from "mongoose";

const Schema = mongoose.Schema

const schemaPedidos = new Schema({
    cliente: {
        type: Schema.ObjectId,
        ref: 'Usuarios'
    },
    pedido: [{
        productos: {
            type: Schema.ObjectId,
            ref: 'Productos'
        },
        cantidad: {
            type: Number,
            trim: true
        }
    }],
    total: {
        type: Number,
        trim: true
    }
})

const Pedidos = mongoose.model('Pedidos', schemaPedidos);
export default Pedidos;