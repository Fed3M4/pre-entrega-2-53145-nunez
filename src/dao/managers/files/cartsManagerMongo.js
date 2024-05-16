import {cartModel} from '../../models/carts.model.js'

export default class CartsManagerMongo {
    constructor(){
        this.model = cartModel
    }

    async getCarts(){
        try {
            console.log('Se cargaron los carritos correctamente')
            return await this.model.find()
          } catch (error) {
            console.error('Hubo un error al buscar los carritos: ', error)
          }
    }

    async createCart(){
        try {
            const cart = await this.model.create({products : []})
            return cart
            
        } catch (error) {
            console.error(error);
        }
    }

    async getCartById(cartID) {
        try {
            let cart = await this.model.find({_id:cartID});
            if(cart){
                console.log('Carrito encontrado')
                return cart
            } else {
                console.log('No existe un carrito con ese id')
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addProductToCart(idCart, idProduct, quantity) {
        try {
            const cart = await cartModel.findOne({_id: idCart});
            if(cart){
                let productIndex = cart.products.findIndex(product => product.product.equals(idProduct))
                console.log(productIndex)
                if(productIndex !== -1) {
                    cart.products[productIndex].quantity += quantity;
                    await cartModel.updateOne({_id: idCart}, {products: cart.products})
    
                } else {
                    cart.products.push({product: idProduct, quantity: quantity})
                    await cartModel.updateOne({_id: idCart}, {products: cart.products})
                }
                return await cartModel.find({_id: idCart})
            }
            return console.log('No existe el carrito a actualizar')
        } catch (error) {
            console.error('Error al agrear pruducto al carrito: ', error)
        }
    }

    async deleteCart(cid) {
        try {
            await cartModel.deleteOne({_id: cid})
            return console.log('Carrito borrado con éxito')
        } catch (error) {
            console.error('No se puede eliminar el carrito por: ', error)
        }
    }

    async deleteProductInCart(cid, products) {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }

    }

    async updateProductsInCart(cid, obj){
        try {
            const filter = { _id: cid, "products._id": obj._id };
            const cart = await cartModel.findById(cid);
            const findProduct = cart.products.some((product) => product._id.toString() === obj._id);

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": obj.quantity } };
                await cartModel.updateOne(filter, update);
            } else {
                const update = { $push: { products: { _id: obj._id, quantity: obj.quantity } } };
                await cartModel.updateOne({ _id: cid }, update);
            }

            return await cartModel.findById(cid);
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            return err;
        }
    };

    async updateOneProduct(cid, products) {
        await cartModel.updateOne(
            { _id: cid },
            { products })
        return await cartModel.findOne({ _id: cid })
    }

}
