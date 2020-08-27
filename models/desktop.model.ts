import { Schema, model, Document } from 'mongoose';

const desktopSchema = new Schema({
    id_company: {type: String, required: [true, 'El id_company es necesario']},
    cd_desktop: {type: String, required: [true, 'El cd_desktop es necesario']},
    id_session: {type: String, ref: 'Session', required: false},
    
},{ collection: "desktops" })

export interface Desktop extends Document { 
    id_company?: string;
    cd_desktop?: string;
    id_session?: string | null;
}
export const Desktop = model<Desktop>('Desktop', desktopSchema);