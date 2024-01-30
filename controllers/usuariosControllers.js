import Usuarios from "../models/Usuarios.js"
import { emailRecuperarCuenta } from "../helpers/mails.js";
import generarToken from "../helpers/token.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


dotenv.config('.env')


const crearUsuario = async (req, res, next) => {
    const { nombre, apellido, email, telefono, password } = req.body;

    if ([nombre, apellido, email, telefono, password].includes('')) {
        res.status(403).json({ msg: "Todos los campos son obligatorios" })
        return next();
    }

    const usuarioExistente = await Usuarios.findOne({ email })

    if (usuarioExistente) {
        res.status(403).json({ msg: "El email ya esta registrado" })
        return next();
    }

    try {
        const usuario = new Usuarios(req.body)
        await usuario.save();
        res.status(200).json({ msg: "Usuario creado correctamente" })

    } catch (error) {
        console.log(error)
        next()
    }
}

const inicioSesion = async (req, res, next) => {
    const { password, email } = req.body;

    const usuario = await Usuarios.findOne({ email })

    if (!usuario) {
        res.status(404).json({ msg: "No se encuentra ningun usuario regristado con ese email" });
        return;
    }

    if (!await usuario.comprobarPassword(password)) {
        res.status(403).json({ msg: "La contraseña es incorrecta" })
        return;
    }

    const token = jwt.sign({ id: usuario._id }, process.env.SECRETA, { expiresIn: '2d' })

    res.status(200).json(token)

}


const mostrarUsuario = async (req, res, next) => {

    if (!req.usuario) {
        res.status(404).json({ msg: "Usuario no encotrado" })
        return next()
    }

    res.status(200).json(req.usuario)
}


const editarUsuario = async (req, res, next) => {
    const { _id } = req.usuario;

    try {
        const usuario = await Usuarios.findByIdAndUpdate({ _id }, req.body);
        await usuario.save()
        res.status(200).json({ msg: "Usuario editado correctamente" })
    } catch (error) {
        console.log(error)
        next()
    }

}
const recuperarCuenta = async (req, res, next) => {
    const { email } = req.body

    const usuario = await Usuarios.findOne({ email })

    if (!usuario) {
        res.status(404).json({ msg: "No se encontro ningun usuario con ese email" });
        return
    }

    const token = generarToken()

    await emailRecuperarCuenta({ email, token, nombre: usuario.nombre })

    try {
        usuario.token = token
        await usuario.save()
        res.status(200).json({ msg: "Enviamos un mensaje a tu correo para recuperar el acceso a tu cuenta." });

    } catch (error) {
        console.log(error)
        next()
    }
}

const comprbarToken = async (req, res, next) => {
    const { token } = req.params

    const usuario = await Usuarios.findOne({ token })

    if (!usuario) {
        res.status(403).json({ msg: "No se encuentra ninguna solicitud de cambio de contraseña" })
        return
    }
    res.status(200).json({ msg: "Token correcto" });
}

const cambiarPassword = async (req, res, next) => {
    const { token } = req.params

    const usuario = await Usuarios.findOne({ token })

    if (!usuario) {
        res.status(403).json({ msg: "No se encuentra ninguna solicitud de cambio de contraseña" })
        return
    }

    const { password, repetirPassword } = req.body;

    if (password !== repetirPassword) {
        res.json({ msg: "Las contraseñas no son iguales." })
        return
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const nuevoPassword = await bcrypt.hash(password, salt);
        await Usuarios.findOneAndUpdate({ token }, { password: nuevoPassword, token: null })
        res.json({ msg: "La contraseña se cambio con exito" })

    } catch (error) {
        console.log(error)
        next()
    }


}

export {
    crearUsuario,
    mostrarUsuario,
    editarUsuario,
    inicioSesion,
    recuperarCuenta,
    comprbarToken,
    cambiarPassword
}