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
const productsModel = mongoose.model(collectionName, productSchema);

// Exportar las funciones específicas
export async function getAllProducts() {
    try {
        const products = await productsModel.find();
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}

export async function getAllProductsFilteredAndPaged(filter, options) {
    try {
        //const result = await productsModel.paginate(filter, options);

        const {
            docs,
            totalDocs,
            page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
        } = await productsModel.paginate(filter, options);

        // console.log(docs);
        // console.log(filter);
        // console.log(options);

        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

        return {
            Payload: docs,
            TotalPages: totalPages,
            PrevPage: prevPage,
            NextPage: nextPage,
            Page: page,
            HasPrevPage: hasPrevPage,
            HasNextPage: hasNextPage,
            PrevLink: prevLink,
            NextLink: nextLink
        };
    } catch (error) {
        throw new Error(`Error al obtener los productos: ${error.message}`);
    }
}

export async function getProductById(productId) {
    try {
        const product = await productsModel.findById(productId);
        return product;
    } catch (error) {
        throw new Error('Error al obtener el producto por ID');
    }
}

export async function createProduct(productData) {
    try {
        const product = new productsModel(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error('Error al crear el producto');
    }
}

export async function updateProduct(productId, newData) {
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(productId, newData, { new: true });
        return updatedProduct;
    } catch (error) {
        throw new Error('Error al actualizar el producto');
    }
}

export async function deleteProduct(productId) {
    try {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error(`El productId ${productId} no es un ObjectId válido`);
        }

        const objectId = new Types.ObjectId(productId);
        const result = await productsModel.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            throw new Error(`Producto con id ${productId} no encontrado`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
}

export async function InsertMany(productsData) {
    try {
        const result = await productsModel.insertMany(productsData);
        return result;
    } catch (error) {
        throw new Error(`Error al insertar productos ${error}`);
    }
}