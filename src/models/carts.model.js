import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Definir el esquema para el carrito de compras
const cartSchema = new Schema({
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    quantity: { type: Number, required: true },
});

// Crear el modelo Cart basado en el esquema
const CartModel = model('Cart', cartSchema);

export default CartModel;