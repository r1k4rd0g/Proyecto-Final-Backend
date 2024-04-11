// Extraer el token de la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Verificar si se ha encontrado un token en la URL
if (token) {
    localStorage.setItem('resetToken', token) //guardamos para usarlo en resetPass.js
    // Hacer una solicitud al backend para verificar el token
    fetch('/api/users/verifyToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => {
        if (response.status === 200) {
            const result = response.json();
            console.log('result ', result)
            alert('En la siguiente ventana, introduzca su nueva contraseña')
            // Si la respuesta es exitosa, redirigir a la página de restablecimiento de contraseña
            window.location.href = `/resetPass`;
        } else {
            // Manejar el caso en que la respuesta no sea exitosa (por ejemplo, el token ha expirado)
            alert('Autorización expirada, debe solicitar nuevamente el email')
            console.error('Error al verificar el token:', response.status);
            window.location.href = '/solicitudEmail';
        }
    })
    .catch(error => {
        console.error('Error al enviar el token al backend:', error);
        // Manejar el error de manera adecuada
    });
} else {
    // Manejar el caso en que no se haya encontrado un token en la URL
    console.error('No se ha encontrado un token en la URL');
}