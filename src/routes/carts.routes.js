import express from 'express';
import { getAllCarts, getCartById, createCart, updateCartById, deleteCartById } from '../models/carts.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cart = await getCartById(pid);
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
        const cart = await createCart(newCart);
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
        const cart = await updateCartById(cartId, modCart);
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
        await deleteCartById(cartId);
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