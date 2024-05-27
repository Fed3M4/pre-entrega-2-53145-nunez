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


router.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const updatedCart = await cmMongo.deleteProductInCart(cid, pid);
      res.status(200).json({ status: 'success', message: `Producto con ID: ${pid} eliminado del carrito`, cart: updatedCart });
  } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito' });
  }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const updatedCart = await cmMongo.deleteAllProductsInCart(cid);
      res.status(200).json({ status: 'success', message: 'Todos los productos eliminados del carrito', cart: updatedCart });
  } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
  }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const products = req.body.products;
      const updatedCart = await cmMongo.updateProductsInCart(cid, products);
      res.status(200).json({ status: 'success', message: 'Carrito actualizado', cart: updatedCart });
  } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
  }
});

// Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updatedCart = await cmMongo.updateOneProduct(cid, pid, quantity);
      res.status(200).json({ status: 'success', message: `Cantidad del producto con ID: ${pid} actualizada`, cart: updatedCart });
  } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
      res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// Obtener carrito por ID con productos poblados
router.get('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await cmMongo.getCartById(cid);
      if (cart) {
          res.status(200).json({ status: 'success', cart });
      } else {
          res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }
  } catch (error) {
      console.error('Error al obtener el carrito:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
  }
});

export {router as cartRouter}