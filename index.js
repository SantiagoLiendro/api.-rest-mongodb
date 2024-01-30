import express, { json, urlencoded } from 'express';
import cors from 'cors'
import dtenv from 'dotenv'

import conectarDB from "./config/db.js";
import usuariosRouter from './router/usuariosRouter.js';
import productoRouter from './router/productoRouter.js';
import pagosRouter from './router/pagosRouter.js';

dtenv.config('.env')
const app = express();

conectarDB()

const dominiosPermitidos = [process.env.URLFRONT]

const corsOption = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) - 1) {
            //El origen del request esta permitido

            callback(null, true)
        } else {
            callback(new Error("No permitido por CORS"))
        }

    }
}

app.use(cors(corsOption))

app.use(json())
app.use(urlencoded({ extended: true }))

app.use(usuariosRouter)
app.use(productoRouter)
app.use(pagosRouter)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Aplicaccion corriendo en el puerto ${port}`)
})



