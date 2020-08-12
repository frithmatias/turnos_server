import { Schema, model, Document } from 'mongoose';

const statusSchema = new Schema({
    id_day: {type: Number, required: [true, 'El id_day es necesario']},
    id_month: {type: Number, required: [true, 'El id_month es necesario']},
    id_year: {type: Number, required: [true, 'El id_year es necesario']},
    id_skill: {type: String, required: [true, 'El id_skill es necesario']},
    cd_number: {type: Number, required: [true, 'El cd_number es necesario']},
},{ collection: "status" })

interface Status extends Document {
    id_day: number;
    id_month: number;
    id_year: number;
    id_skill: string;
    cd_number: number;
}

export const Status = model<Status>('Status', statusSchema);