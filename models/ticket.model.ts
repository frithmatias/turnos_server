import { Schema, model, Document } from 'mongoose';

const ticketsSchema = new Schema({
    id_ticket: {type: Number, required: [true, 'El id del ticket es necesario']},
    id_socket: {type: String, required: [true, 'El socket del cliente en el ticket es necesario']},
    id_socket_desk: {type: String, required: false},
    id_desk: {type: Number, required: false},
    id_company: {type: String, required: [true, 'El id de la empresa es necesario']},
    id_type: {type: String, required: [true, 'El tipo de ticket es necesario']},
    tm_start: {type: Number, required: true, default: + new Date().getTime()},
    tm_att: {type: Number, required: false },
    tm_end: { type: Number, required: false },
},{ collection: "tickets" })

interface Ticket extends Document {
    id_ticket: number;
    id_socket: string;
    id_socket_desk: string | null;
    id_desk: number | null;
    id_company: string;
    id_type: string;
    tm_start: number;
    tm_att: number | null;
    tm_end: number | null;
}

export const Ticket = model<Ticket>('Ticket', ticketsSchema);