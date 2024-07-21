import { promises as fs } from 'fs';

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({title, description, price, thumbnails, code, stock, status, category}) {
        try {
            const arrProducts = await this.readFiles();
            if (!title || !description || !price || !thumbnails || !code || !stock || !status || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            };
            if (arrProducts.some(item => item.code === code)) {
                console.log("Code no se puede repetir");
                return;
            };
            const newProduct = {
                title,
                description,
                price,
                thumbnails: thumbnails || [],
                code,
                stock,
                status: true,
                category
            };
            if (arrProducts.length > 0) {
                ProductManager.ultId = arrProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            };
            newProduct.id = ++ProductManager.ultId;
            arrProducts.push(newProduct);
            await this.saveFile(arrProducts);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        };
    };

    async getProducts() {
        try {
            const arrProducts = await this.readFiles();
            return arrProducts;
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        };
    };

    async getProductsById(id) {
        try {
            const arrProducts = await this.readFiles();
            const search = arrProducts.find(item => item.id === id);
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

    async readFiles() {
        try {
            const resp = await fs.readFile(this.path, "utf-8");
            const arrProducts = JSON.parse(resp);
            return arrProducts;
        } catch (error) {
            console.log("Error al leer archivo", error);
            throw error;
        };
    };

    async saveFile(arrProducts) {
        try {
           await fs.writeFile(this.path, JSON.stringify(arrProducts, null, 2));
        } catch (error) {
            console.log("Error al guardar", error);
            throw error;
        };
    };

    async updateProduct(id, obj) {
        try {
            const arrProducts = await this.readFiles();
            const index = arrProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrProducts[index] = {...arrProducts[index], ...obj};
                await this.saveFile(arrProducts);
                console.log("Producto actualizado");
            } else {
                console.log("producto no encontrado");
            }
        } catch (error) {
            console.log("Error al actualizar producto", error);
            throw error;
        };
    };

    async deleteProduct(id) {
        try {
            const arrProducts = await this.readFiles();
            const index = arrProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrProducts.splice(index, 1);
                await this.saveFile(arrProducts);
                console.log("Producto eliminado");
            } else {
                console.log("producto no encontrado");
            }
        } catch (error) {
            console.log("Error al eliminar producto");
            throw error;
        };
    };
}

export default ProductManager;