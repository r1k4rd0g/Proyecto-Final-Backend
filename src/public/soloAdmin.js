document.getElementById('getAllUsers').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/users/allUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; // Limpiar tabla antes de agregar nuevas filas

        result.data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.Nombre}</td>
                <td>${user.Apellido}</td>
                <td>${user.Email}</td>
                <td>${user.Rol}</td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        alert('Error al obtener todos los usuarios');
    }
});

document.getElementById('deleteAllUsers').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/users/deleteUsers', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await response.json();
        console.log('lo que llega desde el back: ', result)
        if(result.status === 404){
            alert(result.error)
        } else {
            document.getElementById('responseContainer').innerText = JSON.stringify(result.data);
        }
    } catch (error) {
        console.error('Error al eliminar todos los usuarios:', error);
        alert('Error al eliminar todos los usuarios');
    }
});
