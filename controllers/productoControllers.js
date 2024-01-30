import Productos from "../models/Productos.js";
import Categorias from '../models/Categorias.js'
import Usuarios from "../models/Usuarios.js";
import fs from 'node:fs';
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mostarProductos = async (req, res, next) => {
    try {
        const { _id: usuario } = req.usuario
        const productos = await Productos.find({ usuario }).populate([{
            path: 'usuario',
            model: 'Usuarios',
            select: ['-password', '-__v']

        }, 'categoria']).limit(10)
        res.status(200).json(productos.length > 0 ? productos : { msg: "No hay productos, comienza agregando" })
    } catch (error) {
        console.log(error)
        next()
    }

}

const crearProductos = async (req, res, next) => {
    try {
        const { _id: usuarioId } = req.usuario
        const producto = new Productos(req.body)
        if (req?.file.filename) {
            producto.imagen = req.file.filename
        }
        producto.usuario = usuarioId

        await producto.save()
        res.status(200).json({ msg: "Producto creado correctamente" })
    } catch (error) {
        console.log(error)
        next()
    }
}

const mostrarProducto = async (req, res, next) => {
    const { id: _id } = req.params

    try {
        const producto = await Productos.findById(_id).populate([{
            path: 'usuario',
            model: 'Usuarios',
            select: ['-password', '-__v']

        }, 'categoria'])
        if (!producto) {
            res.status(404).json({ msg: "Producto no encontrado" });
            return next()
        }
        res.status(200).json(producto)

    } catch (error) {
        console.log(error)
        next()
    }
}

const editarProducto = async (req, res, next) => {
    const { id: _id } = req.params;
    const producto = await Productos.findById(_id);
    let productoNuevo = req.body;

    if (!producto) {
        res.status(404).json({ mgs: "Producto no encontrado" });
        return
    }

    if (producto.usuario.toString() !== req.usuario.id.toString()) {
        res.status(403).json({ msg: "No tienes los permisos para realizar esta accion" });
        return;
    }

    try {
        if (producto) {
            if (req?.file?.filename) {
                productoNuevo.imagen = req.file.filename
                fs.unlink(`${__dirname}/../uploads/${producto.imagen}`, function (err) {
                    if (err) err;
                    console.log("Imagen Eliminada");
                })
            }
        }

        await Productos.findOneAndUpdate({ _id }, productoNuevo)
        res.status(200).json({ msg: "Producto Editado Correctamente" })
    } catch (error) {
        console.log(error)
        next()
    }

}

const eliminarProducto = async (req, res, next) => {
    const { id: _id } = req.params;
    const producto = await Productos.findById(_id);

    if (producto.usuario.toString() !== req.usuario.id.toString()) {
        res.status(403).json({ msg: "No tienes los permisos para realizar esta accion" });
        return;
    }

    try {

        if (producto?.imagen) {
            fs.unlink(`${__dirname}/../uploads/${producto.imagen}`, function (err) {
                if (err) err;
                console.log("Imagen Eliminado");
            })

        }

        await Productos.findOneAndDelete({ _id });
        res.status(200).json({ msg: "Producto Eliminado Correctamente" })

    } catch (error) {
        console.log(error)
        next();
    }
}
// const existeProducto = async (req, res, next) => {
//     const { id: _id } = req.params

//     const producto = await Productos.findById(_id);

//     if (!producto) {
//         res.status(404).json({ msg: "El producto no existe" })
//         return;
//     }

//     return next();
// }
const productosCategorias = async (req, res, next) => {
    const { categoria } = req.params

    const productos = await Productos.find({ categoria }).populate(['categoria', 'usuario'])
    if (productos.length < 1) {
        res.status(404).json({ msg: "Categoria no encontrada" })
        return;
    }
    res.status(200).json(productos)
}

const buscarProductos = async (req, res, next) => {
    const { busqueda } = req.query

    const productos = await Productos.find({ $text: { $search: busqueda } })

    if (productos.length < 1) {
        res.status(404).json({ msg: "No se encontraron coincidencias" })
        return;
    }
    res.json(productos)
}

const productosDisponibles = async (req, res, next) => {
    const disponible = true
    const productos = await Productos.find({ disponible }).populate([{
        path: 'usuario',
        model: 'Usuarios',
        select: ['-password', '-__v', '-favoritos']
    }, 'categoria']).limit(10)

    res.json(productos || { msg: "No se encontro ningun producto" })
}

const agregarFavoritos = async (req, res, next) => {
    const { productoId } = req.body;
    const { _id } = req.usuario;

    const usuario = await Usuarios.findById(_id)

    let favoritos = usuario.favoritos || [];

    const favoritosFilter = favoritos.filter(producto => { producto._id.toString().split("(")[0] !== productoId.toString() })


    favoritos.push(productoId)

    try {
        await Usuarios.findOneAndUpdate({ _id }, { favoritos })
        res.status(200).json({ msg: "Producto agregado a favoritos" })

    } catch (error) {
        console.log(error)
        next()
    }
}

export {
    crearProductos,
    mostarProductos,
    mostrarProducto,
    editarProducto,
    eliminarProducto,
    productosCategorias,
    buscarProductos,
    productosDisponibles,
    agregarFavoritos
}