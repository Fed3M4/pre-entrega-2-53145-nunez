import {cartModel} from '../../models/carts.model.js'

export default class CartsManagerMongo {
    constructor(){
        this.model = cartModel;
    }

    async getCarts(){
        try {
            console.log('Se cargaron los carritos correctamente');
            return await this.model.find();
        } catch (error) {
            console.error('Hubo un error al buscar los carritos: ', error);
        }
    }

    async createCart(){
        try {
            const cart = await this.model.create({ products: [] });
            return cart;
        } catch (error) {
            console.error(error);
        }
    }

    async getCartById(cartID) {
        try {
            let cart = await this.model.findById(cartID).populate('products.product');
            if(cart){
                console.log('Carrito encontrado');
                return cart;
            } else {
                console.log('No existe un carrito con ese id');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async addProductToCart(idCart, idProduct, quantity) {
        try {
            const cart = await cartModel.findById(idCart);
            if(cart){
                let productIndex = cart.products.findIndex(product => product.product.equals(idProduct));
                if(productIndex !== -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: idProduct, quantity: quantity });
                }
                await cart.save();
                return cart;
            }
            console.log('No existe el carrito a actualizar');
        } catch (error) {
            console.error('Error al agregar producto al carrito: ', error);
        }
    }

    async deleteCart(cid) {
        try {
            await cartModel.findByIdAndDelete(cid);
            console.log('Carrito borrado con éxito');
        } catch (error) {
            console.error('No se puede eliminar el carrito por: ', error);
        }
    }

    async deleteAllProductsInCart(cid) {
        try {
            const cart = await cartModel.findById(cid);
            if (cart) {
                cart.products = [];
                await cart.save();
                return cart;
            }
            console.log('No existe el carrito a actualizar');
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito: ', error);
        }
    }

    async deleteProductInCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);
            if (cart) {
                const productIndex = cart.products.findIndex(product => product.product.equals(pid));
                if (productIndex !== -1) {
                    cart.products.splice(productIndex, 1);
                    await cart.save();
                }
                return cart;
            } else {
                console.log('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar producto del carrito: ', error);
        }
    }

    async updateProductsInCart(cid, products) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cid,
                { products },
                { new: true }
            ).populate('products.product');
            return cart;
        } catch (error) {
            console.error('Error al actualizar productos en el carrito:', error);
        }
    }

    async updateOneProduct(cid, pid, quantity) {
        try {
            const cart = await cartModel.findById(cid);
            if (cart) {
                const productIndex = cart.products.findIndex(product => product.product.equals(pid));
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity = quantity;
                    await cart.save();
                }
                return cart;
            } else {
                console.log('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad de producto en el carrito:', error);
        }
    }
}
