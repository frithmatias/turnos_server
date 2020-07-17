import { Schema, model, Document } from 'mongoose';

const statusSchema = new Schema({
    id_company: {type: String, required: [true, 'El id_copany es necesario']},
    id_day: {type: Number, required: [true, 'El id_day es necesario']},
    id_month: {type: Number, required: [true, 'El id_month es necesario']},
    id_year: {type: Number, required: [true, 'El id_year es necesario']},
    id_type: {type: String, required: [true, 'El id_type es necesario']},
    id_ticket: {type: Number, required: [true, 'El id_ticket es necesario']},
},{ collection: "status" })

interface Status extends Document {
    id_company: string;
    id_day: number;
    id_month: number;
    id_year: number;
    id_type: string;
    id_ticket: number;
}

export const Status = model<Status>('Status', statusSchema);