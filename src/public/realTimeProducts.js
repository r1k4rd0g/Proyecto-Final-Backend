const socket = io();


const productsList = document.getElementById('containerList')
const add = document.getElementById('add');
const btnCargar = document.getElementById('cargar');
const btnEliminar = document.getElementById('eliminar');
const idProduct = document.getElementById('idProduct')

btnEliminar.addEventListener('click', () => {
    const action = document.getElementById('eliminarForm').getAttribute('data-action');
    const userId = localStorage.getItem('userId');
    if (action === 'delete') {
        const idToDelete = idProduct.value
        console.log('producto a eliminar: ', idToDelete)
        socket.emit('deleteProduct', { idToDelete: idToDelete, userId: userId});
        cleanForm2()
    }
});

document.getElementById('add').addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = document.getElementById('add').getAttribute('data-action');
    if (action === 'add') {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const code = document.getElementById('code').value;
        const stock = document.getElementById('stock').value;
        const category = document.getElementById('category').value;
        const thumbnail = document.getElementById('thumbnail').value;
        const data = {
            title: title,
            description: description,
            price: parseInt(price),
            code: code,
            stock: parseInt(stock),
            category: category,
            thumbnail: thumbnail
        };
        console.log('datos a enviar: ', data)
        const socketEmit = socket.emit('solicitud');
        console.log('socket emitido', socketEmit)
        try {
            const response = await fetch('/api/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log('respuesta en front: ', result)
            if (response.status === 200) {
                console.log('resultado', result);
                alert('Producto agregado correctamente');
                cleanForm1()
            } else {
                const error = await response.json();
                console.log('error ', error)
                alert('Error al cargar el producto')
            }
        } catch (error) {
            console.error('Error del catch', error);
        }
    }
})


socket.on('products', (products) => {
    console.log(JSON.stringify(products))
    let infoProducts = '';
    productsList.innerHTML = `<ul>`; //acá se van a ir agregando los productos
    products.forEach(p => {
        console.log(JSON.stringify(p))
        infoProducts += `<li>
            <strong>Titulo: </strong>${p.title}<br>
            <strong>Price: </strong>${p.price}<br>
            <strong>Description: </strong>${p.description}<br>
            <strong>Category: </strong>${p.category}<br>
            <div class="thumbnails">`;
        if (p.thumbnail && p.thumbnail.length > 0) {
            p.thumbnail.forEach(url => {
                infoProducts += `<img class="imgProduct" src="${url}" alt="${p.title}">`;
            });
        }
        infoProducts += `</div></li>`;
    });
    infoProducts += `</ul>`;
    productsList.innerHTML = infoProducts
    console.log(productsList);
    //products.innerHTML = '</ul>';
});

socket.on('productDeleted', (data) => {
        alert(data.message);
});

function cleanForm1() {
    price.value = '';
    title.value = '';
    code.value = '';
    description.value = '';
    stock.value = '';
    category.value = '';
    thumbnail.value = '';
};
function cleanForm2() {
    idProduct.value = '';

};

