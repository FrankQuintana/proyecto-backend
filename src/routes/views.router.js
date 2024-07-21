import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", {products});
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

router.get('/realtimeproducts', async (req, res) => {
    res.render("realtimeproducts");
});

export default router;