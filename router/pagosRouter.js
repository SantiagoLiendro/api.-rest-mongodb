import express from 'express';

import {
    crearOrden, capturarOrden,
    cancelarOrnden, detallesOrden
} from '../controllers/pagosControllers.js';

const router = express.Router()



router.get('/create-order', crearOrden)

router.get('/capture-order', capturarOrden)

router.get('/cancel-order', cancelarOrnden)

router.get('/detalles-orden', detallesOrden)


export default router