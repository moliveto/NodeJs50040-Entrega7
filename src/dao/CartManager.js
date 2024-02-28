import CartModel from '../models/carts.model.js';
import ProductsModel from '../models/products.model.js';

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

    async deleteByCidAndPid(cid, pid) {
        try {
            const deletedCart = await CartModel.findOneAndUpdate(
                { _id: cid }, // Filter by cart ID
                { $pull: { products: { product: pid } } }, // Remove product with pid from products array
                { new: true } // Return the updated cart document
            );
            return deletedCart;
        } catch (error) {
            const errMessage = `Error al eliminar el carrito por cid ${cid}  y pid ${pid} `;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async getCarrito(cid) {
        try {
            const cart = await CartModel.find({ _id: cid }).populate("products.product", { title: 1, price: 1, stock: 1, code: 1 });
            return cart
        } catch (error) {
            return { status: "failed", message: "NO EXISTE EL ID DE INGRESADO" }
        }
    }

    async addProduct(cid, pid, quantity) {

        try {

            console.log(`${cid} ${pid} ${quantity}`);

            const cart = await CartModel.findById(cid);
            //console.log(cart);
            const product = await ProductsModel.findById(pid);
            //console.log(product);

            if (!cart) {
                throw new Error(`No existe el cart ${cid}`);
            }
            if (!product) {
                throw new Error(`No existe el producto ${pid}`);
            }

            const index = cart.products.findIndex(prod => prod.product.toString() === pid);
            console.log(index);
            if (index !== -1) {
                cart.products[index].quantity = quantity + cart.products[index].quantity
            } else {
                cart.products.push({ product: pid, quantity: quantity });
            }

            await cartModel.findOneAndUpdate({ _id: cid }, cart)
            return { status: "success", message: "Producto Agregado", producto: cart }

        } catch (error) {
            return { status: "failed", message: error.message }
        }
    }

}

export default CartManager;