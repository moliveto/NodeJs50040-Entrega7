import { Router } from "express";
import ProductsManager from "../dao/ProductsManager.js";

const router = Router();
const productsManager = new ProductsManager();

router.get("/insertion", async (req, res) => {
    const results = await productsManager.InsertMany();
    return res.json({
        message: `data inserted succesfully`,
        results,
    });
});

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productsManager.getProductById(pid);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener el producto por ID" });
    }
});

// router.get("/", async (req, res) => {
//     try {
//         const products = await getAllProducts();
//         res.send(products);
//     } catch (error) {
//         res.status(500).send({ error: "Error al obtener los productos" });
//     }
// });

router.get("/", async (req, res) => {
    try {
        // Definir los parámetros predeterminados si no se proporcionan en la solicitud
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || ''; // Por ahora solo se considera una búsqueda por título

        // Construir el objeto de opciones para la paginación
        const options = {
            page,
            limit,
            sort: { price: sort } // Ordenar por precio ascendente o descendente
        };

        // Construir el objeto de filtro para la búsqueda
        const filter = null;
        if (query) {
            // Búsqueda por título (ignorando mayúsculas y minúsculas)
            filter = {
                title: { $regex: query, $options: 'i' }
            };
        }


        // Realizar la consulta utilizando mongoose-paginate-v2
        const result = await productsManager.getAllProductsFilteredAndPaged(filter, options);

        res.json({
            status: 'success',
            payload: result.Payload,
            totalPages: result.TotalPages,
            prevPage: result.PrevPage,
            nextPage: result.NextPage,
            page: result.Page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.PrevLink,
            nextLink: result.NextLink
        });
    } catch (error) {
        res.status(500).json({ error: `Error al obtener los productos: ${error.message}` });
    }
});


router.post("/", async (req, res) => {
    try {
        const newProduct = await productsManager.createProduct(req.body);
        res.send(newProduct);
    } catch (error) {
        res.status(500).send({ error: "Error al agregar el producto" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await productsManager.updateProduct(id, req.body);
        res.send(updatedProduct);
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await productsManager.deleteProduct(id);
        res.send(deletedProduct);
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar el producto" });
    }
});

export default router;