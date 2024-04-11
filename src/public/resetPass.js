const resetPasswordForm = document.getElementById('resetPasswordForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

resetPasswordForm.addEventListener('submit',async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no son iguales. Por favor, inténtelo de nuevo.');
        return;
    }
    if (!isPasswordSecure(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluir caracteres especiales, y tener letras mayúsculas y minúsculas.');
        return;
    }
    try {
        const token = localStorage.getItem('resetToken')
        const response = await fetch('/api/users/new-pass', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, token })
        });

        if (response.status === 200) {
            alert('Nueva contraseña establecida correctamente.');
            window.location.href = '/home';
        } else if (response.status === 403) {
            alert('No puedes establecer la misma contraseña. Por favor, ingresa una diferente.');
        } else  if (response.status === 401){
            alert('Expiró el token, solicite nuevamente el email');
            window.location.href = '/solicitudEmail';
        } else  {
            alert ('Algo no salió bien')
        }
    } catch (error) {
        console.error('Error al enviar la nueva contraseña al servidor:', error);
        alert('Error al establecer la nueva contraseña. Por favor, inténtelo de nuevo.');
    }
});


function isPasswordSecure(password) {
    // Verificar longitud mínima
    if (password.length < 8) {
        return false;
    }

    // Verificar caracteres especiales
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialChars.test(password)) {
        return false;
    }

    // Verificar letras mayúsculas y minúsculas
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasUpperCase || !hasLowerCase) {
        return false;
    }

    return true;
}