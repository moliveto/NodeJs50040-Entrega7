// const socket = io.connect('http://localhost:3000')
const form = document.getElementById('addForm')
const botonProds = document.getElementById('botonProductos')
const removeform = document.getElementById('removeForm')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    const prod = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple
    await socket.emit('addProduct', prod)
    await socket.emit('update-products');
    e.target.reset()
})

removeform.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = removeform.elements["id"].value;
    await socket.emit('remove-product', id)
    await socket.emit('update-products');
    e.target.reset()
})

socket.on('products-data', (products) => {
    const tableBody = document.querySelector("#productsTable tbody");
    let tableContent = '';
    if (products && Array.isArray(products)) {
        products.forEach(product => {
            tableContent += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>${product.thumbnail}</td>
                    <td>${product.code}</td>
                    <td>${product.stock}</td>
                    <td>${product.status}</td>
                </tr>
            `;
        });
    } else {
        console.error('No hay productos:', products);
    }

    tableBody.innerHTML = tableContent;
});

socket.on("status-changed", (result) => {
    const msg = result.msg
    const tit = result.status

    Swal.fire({
        title: tit,
        text: msg,
        icon: "info",

    });
})

socket.emit('update-products');