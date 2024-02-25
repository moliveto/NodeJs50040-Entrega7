import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
const { Types } = mongoose;

// Definir el esquema para el producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: 'Sin imagen' },
    //code: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, index: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
    category: { type: String, default: 'Sin Categoria' },
});

productSchema.plugin(mongoosePaginateV2);

// Definir el campo _id como una cadena de texto en lugar de ObjectId
productSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toHexString();
        //delete ret._id;
        delete ret.__v;
    }
});

// Crear el modelo Product basado en el esquema
const collectionName = 'Products';
const ProductsModel = mongoose.model(collectionName, productSchema);

export default ProductsModel;