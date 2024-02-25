import express from 'express';
import CartManager from "../dao/CartManager.js";

const router = express.Router();
const cartManager = new CartManager();

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

router.put('/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        const modCart = req.body;
        const cart = await cartManager.updateCartById(cartId, modCart);
        res.json({
            ok: true,
            message: 'Cart updated',
            cart: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating cart: ${error}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        await cartManager.deleteCartById(cartId);
        res.json({
            ok: true,
            message: 'Cart deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting cart: ${error}`);
    }
});

export default router;