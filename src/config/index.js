import { connect } from "mongoose";

const connectDB = async () => {
    try {
        connect('mongodb+srv://nunezfedema:Fede2064@ecommerce-kame-house.rgfzpsy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=eCommerce-Kame-House')
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

export { connectDB }