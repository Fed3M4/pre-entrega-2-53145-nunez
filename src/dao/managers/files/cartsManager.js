import fs from 'fs/promises';

export default class CartsManager {
    constructor(path){
        this.path = path
    }

    async saveData(cart){
        try {
            const cartJSON = JSON.stringify(cart, null, '\t');
            return this.products = await fs.writeFile(this.path, cartJSON, 'utf-8')
        } catch (error) {
            console.error(error)
        }
    }

    async getCarts(){
        try {
            const cartJSON = await fs.readFile(this.path, "utf-8");
            return JSON.parse(cartJSON);
          } catch (error) {
            return [];
          }
    }

    async createCart(){
        const cart = {
            id: await this.generateId(),
            product: []
        };
        try {
            let carts = await this.getCarts();
            if (carts.some(existingCart => existingCart.id === cart.id)) {
                console.log('Ya existe un producto con el mismo ID. No se puede agregar.');
                return;
            }
            carts.push({...cart});
            await this.saveData(carts)
            console.log('Se agregó el nuevo producto:', cart);
        } catch (error) {
            console.error(error);
        }
    }

    async generateId(){
        this.products = await this.getCarts();
        try {
            if(this.products.length === 0){
                return 1
            } else {
                return this.products.at(-1).id + 1
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getCartById(cartID) {
        try {
            let carts = await this.getCarts();
            const cartFound = carts.find(product => product.id === cartID)
            if(cartFound){
                return cartFound
            } else {
                console.log('No existe un carrito con ese id')
            }
        } catch (error) {
            console.error(error)
        }
    }

    async addProductToCart(idCart, idProduct, quantity) {
        try {
            let carts = await this.getCarts();
            let cartIndex = carts.findIndex(cart => cart.id === idCart);
    
            if (cartIndex !== -1) {
                let cart = carts[cartIndex];
                let productIndex = cart.product.findIndex(product => product.idProduct === idProduct);
                if (productIndex !== -1) {
                    cart.product[productIndex].quantity += quantity;
                } else {
                    cart.product.push({ idProduct: idProduct, quantity: quantity });
                }
    
                carts[cartIndex] = cart;
    
                await this.saveData(carts);
                console.log('Producto agregado al carrito correctamente.');
            } else {
                console.error('No hay ningún carrito con ese ID');
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    }
}
