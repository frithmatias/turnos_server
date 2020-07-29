import { Schema, model, Document } from 'mongoose';

const deskStatSchema = new Schema({
    id_desktop: {type: String, required: [true, 'El id_desktop es necesario']},
    id_assistant: {type: String, required: false, default: null},
    fc_start: {type: Number, required: true, default: + new Date().getTime()},
    fc_end: {type: Number, required: false, default: null},
},{ collection: "deskstats" })

interface DeskStat extends Document { 
    id_desktop?: string;
    id_assistant?: string | null;
    fc_start?: number;
    fc_end?: number | null;
}
export const DeskStat = model<DeskStat>('DeskStat', deskStatSchema);