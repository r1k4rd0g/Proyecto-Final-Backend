import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

export const cartCollection = 'cart';

export const cartSchema = new Schema({
    onCart: [{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product'
                },
        quantity:{ type: Number, default: 1 }
    }]
})
cartSchema.pre ('find', function (){
    this.populate('onCart.product')
})
cartSchema.plugin(mongoosePaginate);

export const CartModel = model (
    cartCollection,
    cartSchema
);
