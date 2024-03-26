import { Schema, model } from "mongoose";

export const msgCollection = 'message';
export const msgSchema = new Schema({
    bodyMessage : {type: String, require: true},
    userMessage: {type: String, require: true}
})

export const MsgModel = model (
    msgCollection,
    msgSchema
);
