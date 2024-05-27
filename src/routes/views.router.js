import {Router} from 'express'
import { __dirname } from '../utils.js'
import { pmMongo } from '../dao/managers/index.js'

const router = Router()
const productService = pmMongo

router.get('/chat', async (req, res) => {
    try {
        const title = 'Chat'
        res.render('chat', {
            title
        })
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }

})

router.get('/home', async (req, res) =>{
    try {
        const title = 'Home';
        const style = './index.css'
        let products = await productService.getProducts()
        res.render('home', {
            title,
            products,
            style
        })
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }

})

router.get("/realTimeProducts",(req,res)=>{
    try {
        res.render("realTimeProducts")
    } catch (error) {
        console.error('No se puede cargar la vista.', error)
    }
})

router.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        
        const products = await pmMongo.getProducts({ limit, page, sort, query });
    
        res.render('products', {
          products: products.docs.map(product => product.toObject()),
          limit: products.limit,
          page: products.page,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
          nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).send({ status: 'error', message: 'Error al cargar los productos' });
      }
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cmMongo.getCartById(cid);
        if (cart) {
            res.render('cart', {
                cart: cart.toObject(),
                products: cart.products.map(p => p.product)
            });
        } else {
            res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

export {router as viewsRouter}
