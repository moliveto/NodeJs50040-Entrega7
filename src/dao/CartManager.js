import CartModel from '../models/carts.model.js';

class CartManager {

    // CREATE - Crear un nuevo carrito
    async createCart(cartData) {
        try {
            const cart = new CartModel(cartData);
            const savedCart = await cart.save();
            return savedCart;
        } catch (error) {
            const errMessage = 'Error al crear el carrito';
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    // READ - Obtener todos los carritos
    async getAllCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            const errMessage = 'Error al obtener los carritos';
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    // READ - Obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            return cart;
        } catch (error) {
            const errMessage = `Error al obtener el carrito por ID ${cartId}`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    // UPDATE - Actualizar un carrito por su ID
    async updateCartById(cartId, newData) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(cartId, newData, { new: true });
            return updatedCart;
        } catch (error) {
            const errMessage = `Error al actualizar el carrito por ID ${cartId}`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    // DELETE - Eliminar un carrito por su ID
    async deleteCartById(cartId) {
        try {
            const deletedCart = await CartModel.findByIdAndDelete(cartId);
            return deletedCart;
        } catch (error) {
            const errMessage = `Error al eliminar el carrito por ID ${cartId}`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }
}

export default CartManager;