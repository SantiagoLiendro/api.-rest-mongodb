import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config('.env')

const transport = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
    }
});


const emailRecuperarCuenta = async ({ email, nombre, token }) => {
    await transport.sendMail({
        from: 'Tienda CRUD',
        to: email,
        subject: 'Cambiar Contraseña',
        text: 'Cambiar Contraseña de Tienda Crud',
        html: `<p>Hola ${nombre}, para cambiar la contraseña de acceso sigue el siguiente 
        <a href="${process.env.URLBACK}${process.env.PORT || 5000}/cambiar-password/${token}">enlace</a>.</p>
        <p>Si no solicitaste ningun cambio de contraseña, ignora este mensaje.</p>
        <p>Saludos desde Tienda CRUD.</p>
        `
    })
}

export {
    emailRecuperarCuenta
}