import { Schema, model } from "mongoose";

//Definimos el nombre de la coleccion
const cartCollection = 'carts'

//Definimos como va a ser la estructura de la coleccion
const cartSchema = new Schema({
    products: {
        type: [
            {
                product:{
                    type: Schema.Types.ObjectId,
                    ref:"products"
                },
                quantity: Number
            }
        ]
    }
})

cartSchema.pre('find', function() {
    this.populate('products.product')
})

export const cartModel = model(cartCollection, cartSchema)