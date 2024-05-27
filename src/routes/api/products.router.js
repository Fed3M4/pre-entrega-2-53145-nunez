import { Router } from 'express';
import { io } from '../../app.js';
import { pmMongo } from '../../dao/managers/index.js';

const router = Router()
const productService = pmMongo

router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    
    const products = await pmMongo.getProducts({ limit, page, sort, query });

    res.json({
      docs: products.docs,
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
});

router.get('/:pid', async(req, res) => {
    try {
        let { limit, page, sort, category } = req.query
        console.log(req.originalUrl);
        console.log(req.originalUrl.includes('page'));
    
        const options = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          sort: { price: Number(sort) }
        };
    
        if (!(options.sort.price === -1 || options.sort.price === 1)) {
          delete options.sort
        }
    
    
        const links = (products) => {
          let prevLink;
          let nextLink;
          if (req.originalUrl.includes('page')) {
            // Si la URL original contiene el parámetro 'page', entonces:
    
            prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
            return { prevLink, nextLink };
          }
          if (!req.originalUrl.includes('?')) {
            // Si la URL original NO contiene el carácter '?', entonces:
    
            prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
            return { prevLink, nextLink };
          }
          // Si la URL original contiene el carácter '?' (otros parámetros), entonces:
    
          prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
          nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
          console.log(prevLink)
          console.log(nextLink)
    
          return { prevLink, nextLink };
    
        }
    
        // Devuelve un array con las categorias disponibles y compara con la query "category"
        const categories = await productService.categories()
    
        const result = categories.some(categ => categ === category)
        if (result) {
    
          const products = await productService.getProducts({ category }, options);
          const { prevLink, nextLink } = links(products);
          const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
          return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        }
    
        const products = await productService.getProducts({}, options);
        // console.log(products, 'Product');
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
      } catch (err) {
        console.log(err);
      }
})

router.post('/', async (req, res) => {
    const { title, description, price, status, stock, category, thumbnail} = req.body;
    if (!title || !description || !price || !status || !stock || !category) {
        return res.send({ status: "error", message: "Faltan completar valores" });
    }
    try {
        await productService.addProduct(title, description, price, status, stock, category, thumbnail);
        const products = await productService.getProducts()
        io.emit('updateProducts', products)
        return res.send({ status: "success", message: "Producto agregado" });
    } catch (error) {
        console.error(error);
    }
});

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updates =  req.body;
    try {
        await productService.updateProduct(pid, updates)
        res.send(await productService.getProductById(pid));
    } catch (error) {
        console.error('El error es: ', error)
        res.send({status: "error", message: "Hubo un error"});
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        await productService.deleteProduct(pid)
        res.send({status: "success", message: "Producto eliminado correctamente"})
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})

export {router as productRouter}