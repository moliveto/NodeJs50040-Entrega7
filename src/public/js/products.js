// Función para cargar la página inicial de productos
function loadProducts(page) {
    fetch(`http://localhost:3000/api/products?limit=10&page=${page}`)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para renderizar los productos en la vista de Handlebars
function renderProducts(data) {
    const template = Handlebars.compile(document.getElementById('product-template').innerHTML);
    const html = template({ products: data.payload });

    const container = document.getElementById('products-container');
    container.innerHTML = html;

    // console.clear();
    // console.log(container);
    // console.log(html);

    document.getElementById('page-info').textContent = `Página ${data.page} de ${data.totalPages}`;

    // Actualizar enlaces de paginación
    document.getElementById('prev-link').href = data.prevLink;
    document.getElementById('next-link').href = data.nextLink;
}

// Evento para cargar la página inicial de productos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(1);
});

// Evento para cargar la página siguiente de productos
document.getElementById('next-link').addEventListener('click', (event) => {
    event.preventDefault();
    const nextPageUrl = event.target.href;
    fetch(nextPageUrl)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error al cargar los productos:', error));
});

// Evento para cargar la página anterior de productos
document.getElementById('prev-link').addEventListener('click', (event) => {
    event.preventDefault();
    const prevPageUrl = event.target.href;
    fetch(prevPageUrl)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Error al cargar los productos:', error));
});

function addToCart(productId) {
    // Lógica para agregar el producto al carrito
    console.log('Producto agregado al carrito:', productId);
}
