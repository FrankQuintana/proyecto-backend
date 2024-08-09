import Router from "express";
import ProductManager from "../dao/db/product.manager.db.js";

const router = Router();
const productManager = new ProductManager();

//listar productos
//Filtro limite paginas ordenamineto
router.get("/", async (req, res)=>{
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = {};
        //filtro - query
        if (query) {
            const queryObject = JSON.parse(query);
            Object.assign(filter, queryObject);
        };
        //orden - sort
        const sortOption = sort === "asc" ? { price: 1 } : sort === "des" ? { price: -1 } : {};
        const options = {
            page: parseInt( page, 10 ),
            limit: parseInt( limit, 10 ),
            sort: sortOption
        };
        const outcome = await productManager.getProducts(filter, options);
        const response = {
            status: "success",
            payload: outcome.docs,
            totalPages: outcome.totalPages,
            prevPage: outcome.hasPrevPage ? outcome.prevPage : null,
            nextPage: outcome.hasNextPage ? outcome.nextPage : null,
            page: outcome.page,
            hasPrevPage: outcome.hasPrevPage,
            hasNextPage: outcome.hasNextPage,
            prevLink: outcome.hasPrevPage ? `/api/products?limit=${limit}&page=${outcome.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: outcome.hasNextPage ? `/api/products?limit=${limit}&page=${outcome.nextPage}&sort=${sort}&query=${query}` : null
        };
        res.json(response);
    } catch (error) {
        console.log("Error al obtetener productos", error);
        res.status(500).json({status: "error", error: "Error del servidor"});
    };
});

//traer producto por id
router.get("/:pid", async (req, res)=>{
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductsById(pidid);
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
        await productManager.updateProduct(pid, productUpdate);
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