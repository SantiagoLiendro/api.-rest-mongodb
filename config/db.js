import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/tiendacrud', {
            useNewUrlParser: true
        })
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`DB Conectada en ${url}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}


export default conectarDB;