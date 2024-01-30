import jwt from 'jsonwebtoken';
import dontenv from 'dotenv';

import Usuarios from '../models/Usuarios.js';

dontenv.config('./')


const protegerRuta = async (req, res, next) => {

    try {
        if (req.headers.authorization.slice(0, 6) === "Bearer") {
            const token = req.headers.authorization.slice(7)

            if (!token) {
                res.status(403).json({ msg: "Token inexistente" })
                return
            }
            const usuarioId = jwt.verify(token, process.env.SECRETA)
            const usuario = await Usuarios.findById(usuarioId.id).select(['-password', '-__v', '-token'])

            if (!usuario) {
                res.status(404).json({ msg: "Usuario no encotrado" });
                return
            }

            req.usuario = usuario
            next()

        }

    } catch (error) {
        console.log(error)
        next()
    }
}


export default protegerRuta