document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('updateForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const token = localStorage.getItem('token')
        const formData = new FormData(form)
        const userId = document.getElementById('userData').getAttribute('data-user-id');

        console.log(userId, 'user id de front')


        const changes = {}; // Objeto para almacenar los cambios realizados en el formulario
        const first_name = formData.get('first_name');
        if (first_name && first_name.length < 2){
            alert('el nombre es demasiado corto');
            return;
        }
        if (first_name){
            changes.first_name = first_name
        }
        const last_name = formData.get('last_name');
        if (last_name && last_name.length < 2){
            alert('el nombre es demasiado corto');
            return;
        }
        if (last_name){
            changes.last_name = last_name
        }
        const age = formData.get('age');
        if (age && !Number.isInteger(Number(age))) {
            alert('La edad debe ser un número entero.');
            return;
        }
        if (age) {
            changes.age = age;
        }

        // Validar el formato de email si se va a actualizar
        const email = formData.get('email');
        if (email && !validateEmail(email)) {
            alert('El formato del email no es válido.');
            return;
        }
        if (email) {
            changes.email = email;
        }

        // Validar la longitud de la contraseña si se va a actualizar
        const password = formData.get('password');
        if (password && password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password) {
            changes.password = password;
        }
        const role = formData.get('role');
        if (role && role !== 'usuario' && role !== 'Premium'){
            alert('rol seleccionado no válido');
            return;
        }
        if (role){
            changes.role = role;
        }
        const url = `/api/users/premium/${userId}`;
        try {
            const response = await fetch(
                url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(changes)
            });
            if (response.ok) {
                const result = await response.json();
                alert('datos actualizados con éxito', result);
                //window.location.href = '/profile';
                window.location.reload();
            } else {
                alert('error al actualizar los datos')
                //console.log('error al actualizar los datos:', response.statusText)
            }
        } catch (error) {
            console.log('Error del catch al enviar los datos para actualizar', error);
        }
    })
})

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}