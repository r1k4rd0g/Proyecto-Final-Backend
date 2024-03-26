export default class ProductResDTO{
    constructor(product){
        console.log('solicitud que llega al ProductResDto:', product );
        this.Titulo = product.Title;
        this.Precio = product.Price;
        this.Descripcion = product.Description;
        this.Categoria = product.Category;
        this.Imagen = product.Thumbnail;
        this.Id = product._id
    }
}

