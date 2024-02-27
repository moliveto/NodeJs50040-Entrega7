import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import CartManager from "../dao/CartManager.js";
import CartModel from '../models/carts.model.js';
const cartManager = new CartManager();
import mongoose from 'mongoose';
const { Types } = mongoose;

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cart = await cartManager.getCartById(pid);
        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving cart: ${error}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const cart = await cartManager.createCart(newCart);
        res.json({
            ok: true,
            message: 'Cart added',
            cart: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error adding cart: ${error}`);
    }
});

// router.put('/:id', async (req, res) => {
//     try {
//         const cartId = req.params.id;
//         const modCart = req.body;
//         const cart = await cartManager.updateCartById(cartId, modCart);
//         res.json({
//             ok: true,
//             message: 'Cart updated',
//             cart: cart,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(`Error updating cart: ${error}`);
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const cartId = req.params.id;
//         await cartManager.deleteCartById(cartId);
//         res.json({
//             ok: true,
//             message: 'Cart deleted',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(`Error deleting cart: ${error}`);
//     }
// });

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid
        await cartManager.deleteByCidAndPid(cid, pid);
        res.json({
            ok: true,
            message: 'Cart deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting cart: ${error}`);
    }
});

// const validateUpdateCart = [
//     body('products').isArray().withMessage('El campo "productos" debe ser un arreglo'),
//     body('products.*.product').isObjectId().withMessage('El campo "producto" debe ser un ObjectId válido'),
//     body('products.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
// ];

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartModel.findByIdAndUpdate(
            cid,
            { $set: { products } },
            { new: true } // Retorna el documento actualizado
        );

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al actualizar el carrito' });
    }
});

const validateUpdateQuantity = [
    body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
];

router.put('/:cid/products/:pid', validateUpdateQuantity, async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).send({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();

        res.status(200).send({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al actualizar la cantidad del producto' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findByIdAndUpdate(cid, { $set: { products: [] } });

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al vaciar el carrito' });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid
    res.send(await cartManager.getCarrito(cid))
})

export default router;