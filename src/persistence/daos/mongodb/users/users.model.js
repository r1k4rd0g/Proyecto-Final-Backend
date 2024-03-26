import { Schema, model } from "mongoose";
import {CartModel} from '../carts/carts.model.js'

export const userCollection = 'userCollection'
export const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        default: '',
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "usuario",
    },
    isGithub: {// para identificar que usuario vino por git
        type: Boolean,
        default: false
    },
    cart: {
        type: Schema.Types.ObjectId, //esto guarda el id del carrito de compras a la cual pertenece un usuario
        ref: CartModel
    }
})

export const UserModel = model(
    userCollection,
    userSchema
);