import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.ultId = 0;
        this.carts = [];
        this.path = path;

        this.chargCarts();
    };

    async chargCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carros desde el archivo", error);
            await this.savCarts();
        };
    };

    async savCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    };

    async createCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        };
        this.carts.push(newCart);

        await this.savCarts();
        return newCart;
    };

    async getCartProducts(cid) {
        try {
            const cart = this.carts.find(c => c.id === cid);
            if (!cart) {
                throw new Error(`No existe carro con id: ${cid}`);
            };
            return cart;
        } catch (error) {
            console.log("Error para obtener elcarro por id", error);
            throw error;
        };
    };

    async uploadProduct(cid, pid, quantity = 1) {
       const cart = await this.getCartProducts(cid);
       const productExist = cart.products.find(p => p.product === pid);
       if (productExist) {
            productExist.quantity += quantity;
       } else {
            cart.products.push({product: pid, quantity});
       };

       await this.savCarts();
       return cart;
    };
};

export default CartManager;