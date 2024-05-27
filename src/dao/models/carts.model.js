import { Schema, model } from "mongoose";

//Definimos el nombre de la coleccion
const cartCollection = 'carts'

//Definimos como va a ser la estructura de la coleccion
const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})

cartSchema.pre('find', function() {
    this.populate('products.product')
})

export const cartModel = model(cartCollection, cartSchema)