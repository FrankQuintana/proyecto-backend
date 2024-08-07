import CartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear cart", error);
            throw error;
        };
    };

    async getCartProducts(cid) {
        try {
            const cart = await CartModel.findById(cid).populate('products.product');
            if (!cart) {
                throw new Error(`No existe cart con id ${cid}`);
            }
            return cart;
        } catch (error) {
            console.log("Error para obtener el carro por id", error);
            throw error;
        };
    };

    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.log("Error al obtener los carts");
        };
    };

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartProducts(cid);
            const productExist = cart.products.find( item => item.product._id.toString() === pid );
            if (!productExist) {
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

    async removeProductFromCart(cid, pid) {
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

    async updateCart(cid, prodts) {
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

    async updateQuantity(cid, pid, quantity) {
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

    async removeAllProducts(cid) {
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