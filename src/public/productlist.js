
const profile = document.getElementById("perfil");
const workWProduct = document.getElementById("workWProduct");
const crearTicket = document.getElementById('crearTicket')
const cartId = document.getElementById('cartId').getAttribute('data-cart-id');


profile.onclick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    //console.log('token almacenado en local storage', token)
    fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        cookie: { 'Authorization': `Bearer ${token}` }
    }).then((response) => {
        if (response.status === 200) {
            const result = response.json()
            console.log('verifica los datos del  usuario logueado', result);
            window.location.href = "/profile";
        } else {
            alert('No hay token habilitado, o no tienes acceso por el rol');
        }
    }).catch((error) => {
        alert('Ocurrió un error al obtener la información', error)
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const userId = document.getElementById('userData').getAttribute('data-user-id');
    //const userId = "{{user._id}}"; // Lee el userId de la vista
    console.log('user id que llega del back: ', userId)
    localStorage.setItem('userId', userId); // Guarda el userId en el localStorage
});

workWProduct.onclick = (e) => {
    e.preventDefault();
    window.location.href = "/realtimeproducts";
};


/** Agregar producto al carrito */
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll('.addToCart');  // Todos los formularios con la clase addToCart
    forms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const productId = form.getAttribute('id')
            console.log(productId, 'productId')
            //const productIdElement = form.querySelector('.productId');
            //const productId = productIdElement.getAttribute('data-product-id');
            console.log('product id: ', productId, 'cart id:', cartId);
            const quantity = parseInt(form.querySelector("input[name='quantity']").value);
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
            console.log('respuesta: ', response)
            if (response.ok) {
                const result = await response.json();
                alert('Producto agregado al carrito con éxito');
                const cartInfo = document.querySelector('.cartInfo');
                const totalProductsElement = cartInfo.querySelector('#totalProducts');
                const totalAmountElement = cartInfo.querySelector('#totalAmount');
                totalProductsElement.textContent = result.totalProducts;
                totalAmountElement.textContent = result.totalPrice;
            } else if (response.status == 403 || false || null) {
                alert('No puedes agregar un producto creado por tí al carrito.')
            } else {
                alert('Error al agregar el producto al carrito o no tienes permisos para hacerlo');
            }
        });
    });
});


/** Creación del ticket */
crearTicket.onclick = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    });
    console.log('respuesta desde el back ', response)
    if (response.status === 200) {
        alert('Ticket generado y enviado con éxito.')
        window.location.href = '/ticket';
    } else (response.status == 500 || 403)
    alert('Ticket no generado, no tienes permisos o hay un error')
}

// Script para manejar la interacción con el backend
const productList = document.getElementById('productList');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumberInput = document.getElementById('pageNumber');
const limitToSee = document.getElementById('limit')
const categoryFilter = document.getElementById('categoryFilter');
const existFilter = document.getElementById('existFilter');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');

async function fetchData(page, limit, category, exist, priceMinValue, priceMaxValue) {
    // Realizar una solicitud al backend con los parámetros necesarios
    const response = await fetch(`/api/products?page=${page}&limit=${limit}&category=${category}&exist=${exist}&priceMin=${priceMinValue}&priceMax=${priceMaxValue}`);
    const data = await response.json();
    return data.products;
}

async function updateProductList() {
    const page = parseInt(pageNumberInput.value);
    const limit = parseInt(limitToSee.value);
    const category = categoryFilter.value;
    const exist = existFilter.checked ? 'yes' : '';
    const priceMinValue = parseInt(priceMin.value) || '';
    const priceMaxValue = parseInt(priceMax.value) || '';
    console.log('limit ', limit)
    const products = await fetchData(page, limit, category, exist, priceMinValue, priceMaxValue);


    // Limpiar la lista de productos y agregar los nuevos productos
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(li);
    });
}

// Eventos para los controles de paginación
prevPageBtn.addEventListener('click', () => {
    pageNumberInput.value = Math.max(parseInt(pageNumberInput.value) - 1, 1);
    updateProductList();
});

nextPageBtn.addEventListener('click', () => {
    pageNumberInput.value = parseInt(pageNumberInput.value) + 1;
    updateProductList();
});

// Eventos para los filtros
categoryFilter.addEventListener('change', updateProductList);
existFilter.addEventListener('change', updateProductList);
priceMin.addEventListener('change', updateProductList);
priceMax.addEventListener('change', updateProductList);

// Cargar la lista de productos al cargar la página
updateProductList();