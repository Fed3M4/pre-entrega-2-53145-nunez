import fs from 'fs/promises';

export default class ProductManager {
    constructor(path){
        this.path = path;
        this.products;
    }

    async saveProducts(data){
        try {
            const dataJSON = JSON.stringify(data, null, '\t');
            return this.products = await fs.writeFile(this.path, dataJSON, 'utf-8')
        } catch (error) {
            console.error(error)
        }
    }

    async getProducts(){
        try {
            const dataJSON = await fs.readFile(this.path, "utf-8");
            return JSON.parse(dataJSON);
          } catch (error) {
            return [];
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
        const product = {
            id: await this.generateId(),
            title: title,
            description: description,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnail: thumbnail,
            code: this.getRandomCode(9),
            
        };
        try {
            let products = await this.getProducts();
            if (products.some(existingProduct => existingProduct.id === product.id)) {
                console.log('Ya existe un producto con el mismo ID. No se puede agregar.');
                return;
            }
            products.push({...product});
            await this.saveProducts(products)
            console.log('Se agregó el nuevo producto:', product);
        } catch (error) {
            console.error(error);
        }
    }

    async generateId(){
        this.products = await this.getProducts();
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

    getRandomCode(length){
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }

    async getProductById(productID) {
        try {
            this.products = await this.getProducts();
            const productFound = this.products.find(product => product.id === productID)
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
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                if (updates.id && updates.id !== productId) {
                    console.log("No se puede cambiar el ID del producto.");
                    return;
                }
                products[productIndex] = { ...products[productIndex], ...updates };
                await this.saveProducts(products)
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
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productID);
            if (productIndex !== -1){
                products.splice(productIndex, 1)
                await this.saveProducts(products)
            } else {
                console.log('El producto con ese ID no existe')
            }
        } catch (error) {
            console.error(error)
        }
    }
}