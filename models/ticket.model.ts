import { Schema, model, Document } from 'mongoose';

const ticketsSchema = new Schema({
    id_parent: {type: String, ref: 'Ticket', required: false},
    id_child: {type: String, ref: 'Ticket', required: false},
    cd_number: {type: Number, required: [true, 'El id del ticket es necesario']},
    id_socket: {type: String, required: [true, 'El socket del cliente en el ticket es necesario']},
    id_socket_desk: {type: String, required: false},
    id_desk: {type: String, ref: 'Desktop', required: false},
    id_assistant: {type: String, required: false},
    id_company: {type: String, required: [true, 'El id de la empresa es necesario']},
    id_skill: {type: String, ref: 'Skill', required: [true, 'El id del skill es necesario']},
    tm_start: {type: Number, required: true, default: + new Date().getTime()},
    tm_att: {type: Number, required: false },
    tm_end: { type: Number, required: false },
},{ collection: "tickets" })

export interface Ticket extends Document {
    id_parent: string | null;
    id_child: string | null;
    cd_number: number;
    id_socket: string;
    id_socket_desk: string | null;
    id_desk: string | null;
    id_assistant: string | null;
    id_company: string;
    id_skill: string;
    tm_start: number;
    tm_att: number | null;
    tm_end: number | null;
}

export const Ticket = model<Ticket>('Ticket', ticketsSchema);