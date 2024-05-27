import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new Schema({
    title: {
        type: String,
        require: true,
        index: true
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    status: {
        type: Boolean,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    thumbnail: {
        type: [String],
        require: true,
    },
    code: {
        type: String,
        inique: true,
        require: true,
        index: true
    }
})
productSchema.plugin(mongoosePaginate)
console.log(mongoosePaginate)

export const productModel = model(productCollection, productSchema)
