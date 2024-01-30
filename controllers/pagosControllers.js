import { config } from "dotenv"
import axios from "axios"
config('.env')

const crearOrden = async (req, res, next) => {
    const order = {
        intent: "CAPTURE",
        purchase_units: [
            {
                reference_id: '654e3242cefc8a2dc0782522',
                amount: {
                    currency_code: 'USD',
                    value: '100.00'
                },
                description: "Libro de tienda"
            },
            {
                reference_id: '654e3242cefc8a2dc0782523',
                amount: {
                    currency_code: 'USD',
                    value: '50.00'
                },
                description: 'Otro pruducto'
            }
        ],
        application_context: {
            brand_name: "Mi tienda",
            user_action: "PAY_NOW",
            return_url: `${process.env.URLBACK}${process.env.PORT || 5000}/capture-order`,
            cancel_url: `${process.env.URLBACK}${process.env.PORT || 5000}/cancel-order`
        }
        // payment_source: {
        //     paypal: {
        //         experience_context: {
        //             landing_page: 'NO_PREFERENCE'
        //         }
        //     }
        // }
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials')

    const { data: { access_token } } = await axios.post(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, params, {
        auth: {
            username: process.env.PAYPAL_API_CLIENT,
            password: process.env.PAYPAL_API_SECRET
        }
    })

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }

    try {
        const respuesta = await axios.post(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, order, { headers })

        console.log(respuesta.data)
    } catch (error) {
        console.log(error.response.data)
    }


    res.send("Desde Capturar")


}


const capturarOrden = async (req, res, next) => {
    const { token } = req.query

    try {
        const response = await axios.post(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: process.env.PAYPAL_API_CLIENT,
                password: process.env.PAYPAL_API_SECRET
            },
            headers: {
                "Content-Type": "application/json"
            }

        })


        return res.json(response.data)
    } catch (error) {
        console.log(error.response.data)
    }


    res.send("Desde Capturar")
}


const cancelarOrnden = async (req, res, next) => {
    res.send("Desde Cancelar")
}

const detallesOrden = async (req, res, nex) => {
    const respuesta = await axios('https://api-m.paypal.com/v2/checkout/orders/{id}')
}


export {
    crearOrden,
    capturarOrden,
    cancelarOrnden,
    detallesOrden
}