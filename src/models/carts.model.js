import mongoose from 'mongoose';
//const { Schema, model } = mongoose;

// Definir el esquema para el carrito de compras
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                    //required: true
                },
                quantity: {
                    type: Number
                    //required: true
                }
            },
        ],
        default: [],
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products._id')
});

// Crear el modelo Cart basado en el esquema
const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;