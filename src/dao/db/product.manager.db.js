import productModel from "../models/product.model.js";

class ProductManager {
    async addProduct({title, description, price, thumbnails, code, stock, status, category}) {
        try {
            if (!title || !description || !price || !thumbnails || !code || !stock || !status || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            };

            const productExixst = await productModel.findOne({ code: code});
            if (productExixst) {
                console.log("Code debe ser unico");
                return;
            };

            const newProduct = new productModel ({
                title,
                description,
                price,
                thumbnails: thumbnails || [],
                code,
                stock,
                status: true,
                category
            });
            await newProduct.save();
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        };
    };

    async getProducts(filter = {}, options = {}) {
        try {
            const result = await productModel.paginate(filter, options);
            result.docs = result.docs.map(doc => doc.toObject());
            return result;
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        };
    };

    async getProductsById(id) {
        try {
            const search = await productModel.findById(id);
            if (!search) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return search;
            };
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        };
    };

    async updateProduct(id, obj) {
        try {
            const product = await productModel.findByIdAndUpdate(id, obj);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto actualizado");
                return product;
            };
        } catch (error) {
            console.log("Error al actualizar producto", error);
            throw error;
        };
    };

    async deleteProduct(id) {
        try {
            const erased = await productModel.findByIdAndDelete(id);
            if (!erased) {
                console.log("producto no encontrado");
                return null;
            } else {
                console.log("Producto eliminado");
                return erased;
            };
        } catch (error) {
            console.log("Error al eliminar producto");
            throw error;
        };
    };
};

export default ProductManager;