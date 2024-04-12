

const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

formLogin.onsubmit = async (e) => {
    e.preventDefault(); //para que la página no se refresque
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' //esto va por defecto
        },
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value
        }),
    })
        .then((response) => {
            return response.json()
            //response.header()
            //response.cookies
        }) //responde por el token
        .then((response) => {
            //console.log('que es esto 2',typeof(response),response); //token
            localStorage.setItem('token', response.token)
            window.location.href = "productlist";
        })
        .catch(error => console.log(error))
    //alert('Email o contraseña mal ingresado')
}
