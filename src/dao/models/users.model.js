import { Schema, model } from "mongoose";

//Definimos el nombre de la coleccion
const userCollection = 'users'

//Definimos como va a ser la estructura de la coleccion
const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        inique: true,
        require: true,

    }
})

export const userModel = model(userCollection, userSchema)