// Función para cargar los productos desde la API
async function loadProductsFromAPI(page) {
    try {
        const response = await fetch(`http://localhost:3000/api/products?limit=5&page=${page}`);
        const data = await response.json();
        //return data.payload;
        return data;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
}

// Función para inicializar la página de productos
function initializeProductsPage() {
    // Evento para cargar la página siguiente de productos
    document.getElementById('next-link').addEventListener('click', async (event) => {
        event.preventDefault();
        const nextPageUrl = event.target.href;
        const data = await fetchProducts(nextPageUrl);
        renderProducts(data);
    });

    // Evento para cargar la página anterior de productos
    document.getElementById('prev-link').addEventListener('click', async (event) => {
        event.preventDefault();
        const prevPageUrl = event.target.href;
        const data = await fetchProducts(prevPageUrl);
        renderProducts(data);
    });
}

// Función para realizar la solicitud a la API y obtener los productos paginados
async function fetchProducts(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
}

// Función para renderizar los productos en la vista de Handlebars
function renderProducts(data) {
    console.log(data)

    const template = Handlebars.compile(document.getElementById('product-template').innerHTML);
    const html = template({ products: data.payload });

    const container = document.getElementById('products-container');
    container.innerHTML = html;

    document.getElementById('page-info').textContent = `Página ${data.page} de ${data.totalPages}`;

    // Actualizar enlaces de paginación
    document.getElementById('prev-link').href = data.prevLink;
    document.getElementById('next-link').href = data.nextLink;
}

// Llama a la función para inicializar la página de productos cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeProductsPage();
    loadProductsFromAPI(1).then(renderProducts); // Carga la primera página de productos al inicio
});

// Función para agregar un producto al carrito
function addToCart(productId) {
    // Lógica para agregar el producto al carrito
    console.log('Producto agregado al carrito:', productId);
}
