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

router.get('/products', (req, res) => {
    
})

export {router as viewsRouter}
