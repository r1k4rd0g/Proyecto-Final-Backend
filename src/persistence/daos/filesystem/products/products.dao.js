import fs from "fs";

export default class ProductDaoFS{
    constructor(path){
        this.path = path;
        this.products=[];
    };
    async getProducts(){
        try {
            if(fs.existsSync(this.path)){
            const productsJSON= await fs.promises.readFile(this.path, 'utf-8')
            const productsJavaScript = JSON.parse(productsJSON);
            //console.log('products desde el getProducts:', productsJavaScript)
            return productsJavaScript;
            }else {return []};
        } catch (error) {
            throw new Error (`Error al leer el archivo: ${error.message}`);
        }
    };
    async getProductById(idSearch){
        try {
            const product = await this.#findProductById(idSearch);
            if (!product){
                throw new Error(`No existe producto con ${idSearch} ingresado.`)
            };
            return product;
        } catch (error) {
            throw new Error (`Error al buscar el producto con ${idSearch}`);
        };
    };
    //función addProduct, modificada para agregar al archivo lo que viene del front y no sobre escribir todo el archivo:
    async addProduct({title, description, code, price, stock, category, thumbnail, owner}) {
    //cargamos los productos actuales:
    const products = await this.getProducts();
    //console.log('console manager 1:', products);
    const existingProduct = products.find((product) => product.code === code);
    //verificamos si ya existe un producto con el mismo código:
    if (existingProduct){
        throw new Error(`Ya existe el producto con ${code} ingresado`);
    }
    try{
        //si no existe, creamos el producto nuevo:
        const newProduct={
            status: true,
            id: this.#generateId(products),
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail,
            owner
        };
        //modificamos la siguiente linea, para poder agregar el nuevo producto a los existentes:
        /*this.products.push(newProduct);---> quedando comiteada para que no se ejecute, a continuación agregamos la que sustituye:*/
        const allProducts = [...products, newProduct]; // esta integra el nuevo producto a los existentes
        //modificamos para que en ves de "guardar" el this.products, lo haga con el allProducts:
        await this.#saveProducts(allProducts);
        return newProduct;
    }catch (error) {
        throw new Error(`Error al agregar el producto: ${error.message}`)
        }
    }
    async updateProduct(idSearch, updateValues){
        try {
            const productFind = await this.#findProductIndexById(idSearch);
            if (productFind === -1){
                throw new Error(`El Producto con ${idSearch} no existe.`);
            }
            const products = await this.getProducts();
            const updateProduct ={
                id:idSearch,
                ...products[productFind],
                ...updateValues
            };
            products[productFind] = updateProduct;
            await this.#saveProducts(products);
            return updateProduct;
        } catch (error) {
            throw new Error (`Error al actualizar con el producto con Id ${idSearch}`);
        }
    };
    async deleteProduct(idSearch){
        try {
            const productFind = await this.#findProductIndexById(idSearch);
            if (productFind === -1){
                throw new Error(`El Producto con Id ${idSearch} no existe.`);
            }
            const products = await this.getProducts();
            const deletedProduct = products.splice(productFind, 1)[0];
            await this.#saveProducts(products);
            return deletedProduct;
        } catch (error) {
                throw new Error (`Error al eliminar el producto con Id ${idSearch}`);
        }
    }
    //**Enclosing Classes *//

#generateId(products){
    if (!products || products.length === 0){
        return 1;
    }
    const maxId = products.reduce((max, product) => product.id > max ? product.id : max, 0, products[0].id);
    return maxId + 1;
}   ;
async #findProductById(idSearch){
    const products = await this.getProducts();
    return products.find((product) => product.id === idSearch);
    }
async #findProductIndexById(idSearch){
    const products = await this.getProducts();
    //console.log('console de findindexbyid:', products);
    return products.findIndex((product) => product.id === idSearch);
    }
async #saveProducts(products){
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

};
