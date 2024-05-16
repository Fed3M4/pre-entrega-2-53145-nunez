import {productModel} from '../../models/products.model.js'
import { getRandomCode } from '../../../utils/functions.js';

export default class ProductManagerMongo {
    constructor(){
        this.model = productModel
    }
    async categories(){
        try {
            const categories = await productModel.aggregate([
                {
                    $group: {
                        _id: null,
                        categories: {$addToSet: "$category"}
                    }
                }
            ])
            return categories[0].categories
        } catch (error) {
            
        }
    }

    async getProducts(filter, options){
        try {
            // const products = await this.model.find({}).lean()
            return await productModel.paginate(filter, options)
          } catch (error) {
            console.error('No se pudo obtener los productos');
            throw error
          }
    }

    /**
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {number} price 
     * @param {boolean} status 
     * @param {number} stock 
     * @param {string} category 
     * @param {[string]} thumbnail 
     */

    async addProduct(title, description, price, status = true, stock, category, thumbnail){
        const code = getRandomCode(9)
        try {
            await this.model.create({title, description, price, status, stock, category, thumbnail, code})
            return this.getProducts()
        } catch (error) {
            console.error(error);
        }
    }

    async getProductById(productID) {
        try {
            const productFound = await this.model.findById({_id: productID})
            if(productFound){
                return productFound
            } else {
                console.log('No existe un producto con ese id')
            }
        } catch (error) {
            console.error(error)
        }
    }

    async updateProduct(productId, updates) {
        try {
            console.log(updates)
            let productUpdate = await this.getProductById(productId)
            if (productUpdate) {
                if (updates.id && updates.id !== productId) {
                    console.log("No se puede cambiar el ID del producto.");
                    return;
                }
                await this.model.findByIdAndUpdate(productId, updates)
                console.log("Producto actualizado correctamente.");
            } else {
                console.log("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(productID){
        try {
            let productDelete = this.getProductById(productID);

            if (productDelete){
                await this.model.deleteOne({_id:productID})
                console.log('Producto borrado');
                return this.getProducts()
            } else {
                console.log('El producto con ese ID no existe')
            }
        } catch (error) {
            console.error(error)
        }
    }
}