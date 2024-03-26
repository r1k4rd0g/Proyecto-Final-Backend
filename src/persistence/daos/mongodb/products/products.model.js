import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserModel } from '../users/users.model.js';

//nombre de la colección de productos:
export const productCollection = 'product';

//requerimientos para crear un producto:
export const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    code:{
        type :String,
        required: true,
        unique: true,
        index: true
    },
    price: {
        type: Number,
        required: true}
        ,
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail:{
        type: [String] //array de strings
    },
    owner:{
        default: "admin",
        required:true,
        type: String
    }
});
//ejecutamos mongoose paginate:
productSchema.plugin(mongoosePaginate);

//exportamos el modelo como ProductModel
export const ProductModel = model (
    'product',
    productSchema
);

