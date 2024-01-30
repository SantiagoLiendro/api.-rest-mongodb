import express from 'express';

import {
    crearUsuario, mostrarUsuario,
    editarUsuario, inicioSesion,
    recuperarCuenta, comprbarToken,
    cambiarPassword,
} from '../controllers/usuariosControllers.js';

import protegerRuta from '../middleware/rutaProtegida.js'

const router = express.Router()


router.post('/usuario/crear', crearUsuario)

router.post('/login', inicioSesion)

router.post('/recuperar-cuenta', recuperarCuenta)

router.route('/cambiar-password/:token')
    .get(comprbarToken)
    .post(cambiarPassword)

router.route('/usuario')
    .get(protegerRuta, mostrarUsuario)
    .put(protegerRuta, editarUsuario)





export default router;