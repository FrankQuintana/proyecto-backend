import mongoose from "mongoose";

mongoose.connect("mongodb+srv://erick182quintana:barto2107@cluster0.eoc9shs.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( () => console.log("Conexion a Base de Datos exitosa!"))
    .catch( (error) => console.log("Error de conexion...", error))