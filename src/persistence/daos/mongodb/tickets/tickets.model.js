import {Schema, model} from 'mongoose';
import { UserModel } from '../users/users.model.js';

//nombre de la colección de tickets
export const ticketsCollection = "tickets"

export const ticketsSchema = new Schema({
    code:{ //Código debe ser un string, se auto genere y sea único.
        type: String,
        required: true
    },
    purchaseDataTime: { //Fecha y hora en que se realizó el pago del ticket.
        type: String,
        required: true
    },
    amount: { //monto total de la compra
        type: Number,
        required: true,
    },
    purchaser:{
        email: {
            type: String,
            ref: UserModel,
            required: true,
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: UserModel,
            required: true,
        }
    }
})


//exportamos el modelo como TicketModel
export const TicketModel = model (
    'tickets',
    ticketsSchema
)