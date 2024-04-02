const socket = io();

const productsList =  document.getElementById('containerList')
const add = document.getElementById('add');
const price = document.getElementById('price');
const title = document.getElementById('title');
const description = document.getElementById('description');
const code = document.getElementById('code');
const stock = document.getElementById('stock');
const category = document.getElementById('category');
const thumbnail = document.getElementById('thumbnail')
const btnCargar = document.getElementById('cargar');
const btnEliminar = document.getElementById('eliminar');



btnEliminar.addEventListener('click', ()=>{
    const action = document.getElementById('eliminarForm').getAttribute('data-action');
    if(action === 'delete'){
        const idToDelete = idProduct.value
        socket.emit('deleteProduct', {data: idToDelete});
    }
})
//esto solo actualiza la vista que está debajo de los formularios en la pag con el nombre realtimeproducts, cuando se completa el diálogo entre socket, ahí recién actualiza
socket.on('products', (products)=>{
    console.log(JSON.stringify(products))
    let infoProducts = '';
    productsList.innerHTML = `<ul>`; //acá se van a ir agregando los productos
    products.forEach(p=>{
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
    cleanForm();
})

function cleanForm(){
    price.value = '';
    title.value = '';
    code.value = '';
    description.value = '';
    stock.value = '';
    category.value= '';
    thumbnail.value= '';
};


