import { Router } from "express";
import ProductManager from "../dao/db/product.manager.db.js";
import CartManager from "../dao/db/cart.manager.db.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.log("Error al mostrar productos", error);
        res.status(500).send({ error: "Error del servidor" });
    };
});

router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc' } =req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { price: sort === 'asc' ? 1 : -1 }
    };
    try {
        const products = await productManager.getProducts({}, options);
        res.render("home", { products: products.docs, ...products });
    } catch (error) {
        console.log("Error al mostrar productos", error);
        res.status(500).send({ error: "Error del servidor" });
    };
});

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const car = await cartManager.getCartProducts(cid);
        if (!car) {
            console.log("Carrito no existe");
            return res.status(404).json({ error: "Carro no encontrado"});
        };
        const productsInCar = car.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));
        res.render("carts", { products: productsInCar });
    } catch (error) {
        console.log("Error al obtener productos", error);
        res.status(500).send({ error: "Error del servidor" });
    };
});

export default router;