import { Schema, model, Document } from 'mongoose';

const desktopSchema = new Schema({
    id_company: {type: String, required: [true, 'El id_company es necesario']},
    id_desktop: {type: String, required: [true, 'El id_desktop es necesario']},
},{ collection: "desktops" })

interface Desktop extends Document { 
    id_company?: string;
    id_desktop?: string;
}
export const Desktop = model<Desktop>('Desktop', desktopSchema);