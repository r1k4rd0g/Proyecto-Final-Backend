
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
