import express from 'express';

import {
    crearProductos, mostarProductos,
    mostrarProducto, editarProducto,
    eliminarProducto, productosCategorias,
    buscarProductos, productosDisponibles,
    agregarFavoritos
} from '../controllers/productoControllers.js';
import subirAcrihvo from '../middleware/multer.js';
import protegerRuta from '../middleware/rutaProtegida.js';

const router = express.Router()

router.get('/mostrar-productos', protegerRuta, mostarProductos)

router.post('/crear-productos', protegerRuta, subirAcrihvo, crearProductos)

router.route('/producto/:id')
    .get(mostrarProducto)
    .put(protegerRuta, subirAcrihvo, editarProducto)
    .delete(protegerRuta, eliminarProducto)

router.get('/productos/:categoria', productosCategorias)

router.post('/buscar-producto', buscarProductos)

router.get('/productos-disponibles', productosDisponibles)

router.route('/productos/favoritos')
    .post(protegerRuta, agregarFavoritos)













export default router