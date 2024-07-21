import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./controllers/productManager.js"

const app = express();
const PORT = 8080;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log(`Servidor http://localhost:${PORT} en linea`);
});

const productManager = new ProductManager("./src/models/products.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");

    //array de productos "se envia"
    socket.emit("products", await productManager.getProducts());
    //eliminar productos front "se recibe"
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        //array productos actualizados
        io.sockets.emit("products", await productManager.getProducts());
    });
    //productos por fomulario
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        //array productos actualizados
        io.sockets.emit("products", await productManager.getProducts());
    });
});