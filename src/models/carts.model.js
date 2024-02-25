import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definir el esquema para el carrito de compras
const cartSchema = new Schema({
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    quantity: { type: Number, required: true },
});

// Crear el modelo Cart basado en el esquema
const Cart = model('Cart', cartSchema);

// Métodos CRUD

// CREATE - Crear un nuevo carrito
async function createCart(cartData) {
    try {
        const cart = new Cart(cartData);
        const savedCart = await cart.save();
        return savedCart;
    } catch (error) {
        throw new Error('Error al crear el carrito');
    }
}

// READ - Obtener todos los carritos
async function getAllCarts() {
    try {
        const carts = await Cart.find();
        return carts;
    } catch (error) {
        throw new Error('Error al obtener los carritos');
    }
}

// READ - Obtener un carrito por su ID
async function getCartById(cartId) {
    try {
        const cart = await Cart.findById(cartId);
        return cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito por ID');
    }
}

// UPDATE - Actualizar un carrito por su ID
async function updateCartById(cartId, newData) {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, newData, { new: true });
        return updatedCart;
    } catch (error) {
        throw new Error('Error al actualizar el carrito por ID');
    }
}

// DELETE - Eliminar un carrito por su ID
async function deleteCartById(cartId) {
    try {
        const deletedCart = await Cart.findByIdAndDelete(cartId);
        return deletedCart;
    } catch (error) {
        throw new Error('Error al eliminar el carrito por ID');
    }
}

export {
    Cart,
    createCart,
    getAllCarts,
    getCartById,
    updateCartById,
    deleteCartById
};
