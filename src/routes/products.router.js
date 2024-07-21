import Router from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();
const productManager = new ProductManager("./src/models/products.json");

//listar productos
router.get("/", async (req, res)=>{
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        };
    } catch (error) {
        console.log("Error al obtetener productos", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

//traer producto por id
router.get("/:pid", async (req, res)=>{
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductsById(parseInt(pid));
        if (!product) {
            return res.json({error: "Producto no encontrado"});
        };
        res.json(product)
    } catch (error) {
        console.log("Error al obtetener productos", error);
        res.status(500).json({error: "Error del servidor"});
    };
});
//agregar nuevo producto
router.post("/",async (req, res)=>{
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({messaje: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("Error al agregar productos", error);
        res.status(500).json({error: "Error del servidor"});
    };
});
//actualizar por id
router.put("/:pid",async (req, res)=>{
    const pid = req.params.pid;
    const productUpdate = req.body;
    try {
        await productManager.updateProduct(parseInt(pid), productUpdate);
        res.json({messaje: "Producto actualizado exitosamente"});
    } catch (error) {
        console.log("Error al actualizar productos", error);
        res.status(500).json({error: "Error del servidor"});
    };
});
//eliminar producto
router.delete("/:pid",async (req, res)=>{
    const pid = req.params.pid;
    try {
        await productManager.deleteProduct(parseInt(pid));
        res.send({messaje: "producto eliminado exitosamente"});
    } catch (error) {
        console.log("Error al eliminar productos", error);
        res.status(500).json({error: "Error del servidor"});
    };
});

export default router;