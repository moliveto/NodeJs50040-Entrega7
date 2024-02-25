import fs from "fs";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.isInitialized = false;
    }

    async addProduct(product) {
        // Validar que no se repita el código
        if (this.products.find((p) => p.code === product.code)) {
            throw new Error("El código del producto ya existe");
        }

        // Validar que todos los campos obligatorios estén presentes
        const requiredFields = ['title', 'description', 'price', 'code', 'stock'];
        const missingFields = requiredFields.filter(field => !product.hasOwnProperty(field));
        if (missingFields.length > 0) {
            throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        }

        // Generar ID automático para el producto
        const id = this.generateProductId();
        product.id = id;

        // Establecer el valor predeterminado para el campo 'status'
        product.status = true;

        // Guardar el producto en el arreglo
        this.products.push(product);

        // Guardar el arreglo en el archivo
        await this.writeToFile();

        return product;
    }

    generateProductId() {
        // Calcular el nuevo ID basado en la longitud del arreglo de productos
        return this.products.length + 1;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        return this.products.find((p) => p.id == id);
    }

    async updateProduct(id, product) {
        // Validar que el producto exista
        const existingProduct = await this.getProductById(id);
        if (!existingProduct) {
            throw new Error("El producto no existe");
        }

        // Actualizar el producto
        Object.assign(existingProduct, product);

        // Guardar el arreglo en el archivo
        await this.writeToFile();

        return existingProduct;
    }

    async deleteProduct(id) {
        // Validar que el producto exista
        const existingProductIndex = this.products.findIndex((p) => p.id == id);
        if (existingProductIndex === -1) {
            throw new Error("El producto no existe");
        }

        // Eliminar el producto del arreglo
        this.products.splice(existingProductIndex, 1);

        // Guardar el arreglo en el archivo
        await this.writeToFile();
    }

    async readFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log("File readed");
        } catch (error) {
            console.error('Error initializing ProductManager:', error);
            console.log("File error");
            this.products = [];
        }
    }

    async writeToFile() {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify(this.products, null, 2);
                fs.writeFileSync(this.path, data);
                resolve("write Ok");
            } catch (error) {
                reject("write fail", error);
            }
        });
    }

}

export default ProductManager;