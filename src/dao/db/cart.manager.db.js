import CartModel from "../models/cart.model.js";

class CartManager {

    async createCart() {//crear carro
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear cart", error);
            throw error;
        };
    };

    async getCartProducts(cid) {//listar
        try {
            const cart = await CartModel.findById(cid).populate('products.product');
            if (!cart) {
                throw new Error(`No existe cart con id ${cid}`);
            };
            return cart;
        } catch (error) {
            console.log("Error para obtener el carro por id", error);
            throw error;
        };
    };

    async getCarts() {//obtener carro
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.log("Error al obtener los carts");
        };
    };

    async addProductToCart(cid, pid, quantity = 1) {//agrgar producto
        try {
            const cart = await this.getCartProducts(cid);
            const productExist = cart.products.find( item => item.product._id.toString() === pid );
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            };
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        };
    };

    async removeProductFromCart(cid, pid) {//eliminar
        try {
            const cart = await this.getCartProducts(cid);
            cart.products = cart.products.filter( item => item.product._id.toString() !== pid );
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar producto", error);
            throw error;
        };
    };

    async updateCart(cid, prodts) {//actualizar carro
        try {
            const cart = await this.getCartProducts(cid);
            cart.products = prodts;
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al actualizar producto", error);
            throw error;
        };
    };

    async updateQuantity(cid, pid, quantity) {//act cantidad
        try {
            const cart = await this.getCartProducts(cid);
            const product = cart.products.find( item => item.product._id.toString() === pid );
            if (product) {
                product.quantity = quantity;
                cart.markModified("products");
                await cart.save();
                return cart;
            } else {
                throw new Error(`Producto con id ${pid} no se encontro`);
            };
        } catch (error) {
            console.log("Error al actualizar cantidad de productos", error);
            throw error;
        };
    };

    async removeAllProducts(cid) {//eliminar todo
        try {
            const cart = await this.getCartProducts(cid);
            cart.products = [];
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al eliminar todos los productos", error);
            throw error;
        };
    };
};

export default CartManager;