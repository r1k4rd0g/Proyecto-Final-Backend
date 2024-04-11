const solicitarEmail = document.getElementById('solicitarEmail');
const formSolicitarEmail = document.getElementById('formSolicitarEmail');

formSolicitarEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = formSolicitarEmail.querySelector('input');
    const email = emailInput.value;
    console.log('email a mandar: ', email);
    if (!emailValidator(email)) {
        alert('Ingrese un email válido');
        emailInput.focus(); // colocar el foco en el campo de email
        return;
    }
    try {
        const response = await fetch('api/users/reset-pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        console.log('respuesta: ', response)
        if (response.status === 200) {
            const result = await response.json();
            console.log('result ', result)
            alert("Se ha enviado un correo electrónico a tu dirección para restablecer la contraseña");
            window.location.href = '/home';
        } else {
            alert('error, algo no salió bien')
        }
    } catch (error) {
        alert('Entró en el catch: ', error);
        console.log('entró en el catch: ', error)

    }

})

function emailValidator(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}