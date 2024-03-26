

const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

formLogin.onsubmit = (e) => {
    e.preventDefault(); //para que la página no se refresque
    fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({
            email: inputEmail.value,
            password: inputPassword.value
        }),
        headers: {
            'Content-Type': 'application/json' //esto va por defecto
        },
    })
        .then((response) => {
            //console.log('que es esto 1',typeof(response),response)
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
}
