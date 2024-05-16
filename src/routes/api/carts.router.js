import { Router } from 'express';
import { cmMongo, pmMongo } from '../../dao/managers/index.js';

const router = Router()

router.get('/', async (req, res) => {
    try {
        const cart = await cmMongo.getCarts()
        if(!cart) console.log('No hay ningún carrito')
        res.send(cart)
    } catch (error) {
        console.error('Hubo un error al traer los carritos: ', error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const selectedCart = await cmMongo.getCartById(cid)
        res.send(selectedCart)
    } catch (error) {
        console.error('Hubo un error al traer los carritos.', error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        await cmMongo.createCart()
        res.send({ status: "success", message: "Carrito creado correctamente" });
    } catch (error) {
        console.error(error);
        res.send({ status: "error", message: "Error al crear carrito" });
    }
});

router.put('/:cid/product/:pid', async(req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const {quantity} = req.body;
    try {
        let cartUpdate = await cmMongo.addProductToCart(cid, pid, quantity)
        res.send({status: 'success', payload: cartUpdate})
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        await cmMongo.deleteCart(cid)
        res.send("Carrito borrado con éxito")
    } catch (error) {
        console.error('Hubo un error al eliminar el carrito: ', error)
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        // Extraer los parámetros de la URL: cid (ID del carrito) y pid (ID del producto)
        const { cid, pid } = req.params;
    
        // Verificar si el producto con el ID pid existe
        const checkIdProduct = await pmMongo.getProductById(pid);
        if (!checkIdProduct) {
          return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no existe` });
        }
    
        // Verificar si el carrito con el ID cid existe
        const checkIdCart = await cmMongo.getCartById(cid);
        if (!checkIdCart) {
          return res.status(404).send({ status: 'error', message: `Cart con ID: ${cid} no existe` });
        }
    
        // Buscar el índice del producto en la lista de productos del carrito
        const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
        if (findProductIndex === -1) {
          return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado en cart` });
        }
    
        // Eliminar el producto de la lista de productos del carrito
        checkIdCart.products.splice(findProductIndex, 1);
    
        // Actualizar el carrito en la base de datos sin el producto eliminado
        const updatedCart = await cmMongo.deleteProductInCart(cid, checkIdCart.products);
    
        return res.status(200).send({ status: 'success', message: `Borrado el producto con ID: ${pid}`, cart: updatedCart });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 'error', message: 'Error al procesar el request' });
      }
})

router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
  
      // Verificar si todos los productos existen antes de actualizar el carrito
      for (const product of products) {
        const checkId = await pmMongo.getProductById(product._id);
  
        if (!checkId) {
          return res.status(404).send({ status: 'error', message: `El ID del producto: ${product._id} no existe` });
        }
      }
  
      // Verificar si el carrito con el ID cid existe
      const checkIdCart = await cmMongo.getCartById(cid);
      if (!checkIdCart) {
        return res.status(404).send({ status: 'error', message: `El ID cart: ${cid} no existe` });
      }
  
      // Actualizar el carrito en la base de datos con la lista de productos actualizada
      const cart = await cmMongo.updateProductsInCart(cid, products);
      return res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 'error', message: 'Ocurrió un error al procesar este request' });
    }
  });

export {router as cartRouter}