import ProductsManager from './files/productManager.js';
import CartsManager from './files/cartsManager.js';
import { __dirname } from '../../utils.js';
import ProductManagerMongo from './files/productManagerMongo.js';
import CartsManagerMongo from './files/cartsManagerMongo.js';

export const pm = new ProductsManager(__dirname+'/data/productos.json');
export const cm = new CartsManager(__dirname+'/data/carrito.json');
export const pmMongo = new ProductManagerMongo()
export const cmMongo = new CartsManagerMongo()