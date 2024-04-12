export class UserResDTO {
    constructor(user) {
        //console.log('user que llega al UserResDTO:', user);
        this.Nombre = user.first_name;
        this.Apellido = user.last_name;
        this.Email = user.email;
        this.Rol = user.role;
        this.Id = user._id
    }
}

export class UserBasicDataDto {
    constructor(user) {
        //console.log('user que llega al UserResDTO:', user);
        this.Nombre = user.first_name;
        this.Apellido = user.last_name;
        this.Email = user.email;
        this.Rol = user.role;
    }
}