import ProductsModel from '../models/products.model.js';
import { getAllProductsFromJson } from '../data/product-data.js';

class ProductManager {
    async getAllProducts() {
        try {
            const products = await ProductsModel.find();
            return products;
        } catch (error) {
            const errMessage = 'Error al obtener los productos';
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async getAllProductsFilteredAndPaged(filter, options) {
        try {
            const {
                docs,
                totalDocs,
                page,
                totalPages,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
            } = await ProductsModel.paginate(filter, options);

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

    async getProductById(productId) {
        try {
            const product = await ProductsModel.findById(productId);
            return product;
        } catch (error) {
            const errMessage = `Error al obtener los productos por ID ${cartId}`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const product = new ProductsModel(productData);
            const savedProduct = await product.save();
            return savedProduct;
        } catch (error) {
            const errMessage = `Error al crear el producto`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async updateProduct(productId, newData) {
        try {
            const updatedProduct = await ProductsModel.findByIdAndUpdate(productId, newData, { new: true });
            return updatedProduct;
        } catch (error) {
            const errMessage = `Error al actualizar el producto`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            if (!Types.ObjectId.isValid(productId)) {
                throw new Error(`El productId ${productId} no es un ObjectId válido`);
            }

            const objectId = new Types.ObjectId(productId);
            const result = await ProductsModel.deleteOne({ _id: objectId });

            if (result.deletedCount === 0) {
                throw new Error(`Producto con id ${productId} no encontrado`);
            }
            return result;
        } catch (error) {
            const errMessage = `Error al eliminar el producto ${productId}`;
            throw new Error(`${errMessage}: ${error.message}`);
        }
    }

    async InsertMany() {
        try {
            const productsData = await getAllProductsFromJson();
            const result = await ProductsModel.insertMany(productsData);
            return result;
        } catch (error) {
            throw new Error(`Error en insersion masiva de productos ${error}`);
        }
    }
}

export default ProductManager;