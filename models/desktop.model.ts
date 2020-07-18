import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const desktopSchema = new Schema({
    id_company: {type: String, required: [true, 'El id_company es necesario']},
    id_desktop: {type: String, unique: true, required: [true, 'El id_desktop es necesario']},
    id_type: {type: String, required: false},
    fc_from: {type: Date, required: false},
    fc_to: {type: Date, required: false},
},{ collection: "desktops" })

interface Desktop extends Document {
    id_company: string;
    id_desktop: string;
    id_type: string | null;
    fc_from: Date;
    fc_to: Date;
}
desktopSchema.plugin( uniqueValidator, {message: 'El campo {PATH} debe de ser unico'} );
export const Desktop = model<Desktop>('Desktop', desktopSchema);