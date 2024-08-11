import express from "express";
import CartManager from "../dao/db/cart.manager.db.js"

const router = express.Router();
const cartManager = new CartManager();

//crear carrito nuevo
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.log("Error al crear carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.getCarts();
        res.status(200).json(cart);
    } catch (error) {
        console.log("Error al obtener los carts", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

//lista productos carros
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartManager.getCartProducts(cid);
        res.json(cart.products);
    } catch (error) {
        console.log("Error al obteber carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

//agregar productos carro
router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.params.quantity || 1;

    try {
        const updateCar = await cartManager.addProductToCart(cid, pid, quantity);
        if (updateCar) {
            res.json(updateCar.products);  
        } else {
            res.status(404).json({ error: "carro o producto no encontrado" });
        };
    } catch (error) {
        console.log("Error al agregar productos al carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const updateCar = await cartManager.removeProductFromCart(cid, pid);
        res.json(updateCar.products);
    } catch (error) {
        console.log("Error al eliminar producto del carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

router.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const products = req.params.products;
    try {
        const updateCar = await cartManager.updateCart(cid, products);
        res.json(updateCar.products);
    } catch (error) {
        console.log("Error al eliminar producto del carrito", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.params.quantity;
    try {
        const updateCar = await cartManager.updateQuantity(cid, pid, quantity);
        res.json(updateCar.products);
    } catch (error) {
        console.log("Error al actualizar cantidad del producto del carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const updateCar = await cartManager.removeAllProducts(cid);
        res.json(updateCar.products);
    } catch (error) {
        console.log("Error al eliminar todos los productos del carrito", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

export default router;