import path from 'path';
import express from 'express';
import mongoose from "mongoose";
import { Server as IO } from "socket.io";

import displayRoutes from 'express-routemap';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import messageRoutes from './routes/mensajes.routes.js';

import pkg from './config.cjs';
const { mongoURI } = pkg;
import __dirname from "./utils.js";

import { getProductById, getAllProducts, createProduct, deleteProduct } from './models/products.model.js';

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB establecida');
}).catch(err => console.log('Error al conectar a MongoDB:', err));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/messages", messageRoutes);

const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Listening on ${PORT}`);
});
httpServer.on('error', () => console.log(`Error: ${err}`));

// Socket
const io = new IO(httpServer);
const messages = [];
io.on('connection', socket => {
    console.log("Nuevo cliente conectado: ", socket.id);

    socket.on('update-products', async () => {
        console.log("inicio update socket")
        const products = await getAllProducts();
        //console.log(products);
        socket.emit('products-data', products);
    });

    socket.on('addProduct', async (newProd) => {
        console.log("inicio add socket");
        const response = await createProduct(newProd);
        //console.log(response)
        const products = await getAllProducts();
        socket.emit('products-data', products);
        socket.emit("status-changed", response);
    });

    socket.on('remove-product', async (id) => {
        console.log(`inicio remove socket ${id}`)
        const result = await deleteProduct(id);
        socket.emit("status-changed", result)
        const products = await getAllProducts();
        socket.emit('products-data', products);
        console.log("fin remove socket")
    });

    socket.on("message", (data) => {
        messages.unshift(data);
        io.emit("messageLogs", messages);
    });

    socket.on("user-login", (usr) => {
        socket.emit("messageLogs", messages)
        socket.broadcast.emit("new-user", usr)
    });
});

app.use("/static", express.static(__dirname + "/public"))
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/home', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))

// Handlebars
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("index", {})
})

// Views
app.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {})
})

app.get("/home", async (req, res) => {
    const products = await getAllProducts()
    res.render("home", { ...products })
})

// app.get("/chat", async (req, res) => {
//     res.render("chat", {})
// })

app.get('/chat', (req, res) => {
    res.render('chat', {
        layout: false,
    });
});