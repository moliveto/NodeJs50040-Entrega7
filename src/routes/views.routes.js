import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";
import ProductsModel from "../models/products.model.js"
import CartModel from '../models/carts.model.js';

const viewsRoute = Router();
const productsManager = new ProductsManager();

viewsRoute.get("/", (req, res) => {
    res.render("index", {})
})

viewsRoute.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", {})
})

viewsRoute.get("/home", async (req, res) => {
    const products = await productsManager.getAllProducts()
    res.render("home", { ...products })
})

viewsRoute.get("/chat", async (req, res) => {
    res.render("chat", {
        js: "chat.js",
        css: "chat.css",
        layout: false,
    })
})

// vista de productos en handlebars con boton comprar
viewsRoute.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort, filter } = req.query
    try {

        const sortTogle = (sort) => {
            let srt = parseInt(sort)
            console.log(srt)
            console.log(sort)
            if (sort === undefined) return 1
            else { return srt *= -1 }
        }

        const sorting = sortTogle(sort)

        const response = await ProductsModel.paginate({ filter }, { limit: limit, page: page, sort: { price: sorting } })

        if (page > response.totalPages) {
            return res.json({ status: "failed", message: "LA PAGINA SELECCIONADA NO EXISTE" })
        }

        const cart = await CartModel.create({})

        //Convierto la query de mongo a un objeto javascript plano para que lo pueda leer Handlebars
        const products = response.docs.map(doc => {
            return {
                id: doc._id,
                cart: cart._id,
                title: doc.title,
                description: doc.description,
                category: doc.category,
                thumbnail: doc.thumbnail,
                price: doc.price,
                stock: doc.stock,
                code: doc.code
            }
        })

        //paso el objeto plano al view de handlebars
        res.render("products", {
            docs: products,
            page: response.page,
            sort: sorting,
            nextPage: response.nextPage,
            prevPage: response.prevPage,
            totalPages: response.totalPages,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
        })

    } catch (error) {
        return res.json({ status: "failed", error: error.message })
    }
});

viewsRoute.get("/cart/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartModel.findOne({ _id: cid }).populate("products.product", { title: 1, price: 1, stock: 1, code: 1, description: 1 });

        const cartModel = cart.products.map(item => {
            return {
                id: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                title: item.product.title,
                description: item.product.description,
            }
        })

        res.render("cart", {
            cart: cid,
            item: cartModel,
        })

    } catch (error) {
        return res.json({ status: "failed", error: error.message })
    }
})

export default viewsRoute;