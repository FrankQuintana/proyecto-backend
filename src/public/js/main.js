const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});

//funcion renderizar productos
const renderProducts = (data) => {
    const containerProducts = document.getElementById("contProducts");
    //importante para no duplicar
    containerProducts.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                            <p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                         `
        containerProducts.appendChild(card);

        //evento boton eliminar
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
};

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

//productos con el formulario
document.getElementById("btnEnv").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        status: document.getElementById("status").value === "true",
        thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    };
    socket.emit("addProduct", product);
};