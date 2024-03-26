export default class UserResDTO{
    constructor(user){
        console.log('user que llega al UserResDTO:', user);
        this.Nombre = user.first_name;
        this.Apellido = user.last_name;
        this.Email = user.email;
        this.Rol = user.role;
    }
}

