import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const menuSchema = new Schema({
    cd_role: { type: Number, required: [true, 'El cd_role es necesario'] },
    tx_titulo: { type: String, required: [true, 'El tx_titulo es necesario'] },
    tx_icon: { type: String, required: [true, 'El tx_icon es necesario'] },
    tx_url: { type: String, required: [true, 'El tx_url es necesario'] },
    ar_submenu: { type: [{
        cd_pricing: { type: Number, required: [true, 'El cd_pricing es necesario'] },
        tx_titulo: { type: String, required: [true, 'El tx_titulo es necesario'] },
        tx_icon: { type: String, required: [true, 'El tx_icon es necesario'] },
        tx_url: { type: String, required: [true, 'El tx_url es necesario'] },
    }]},
}, { collection: "menus" })

interface Menu extends Document {
    cd_role: number;
    tx_titulo: string;
    tx_icon: string;
    ar_submenu: SubMenu[];
}

interface SubMenu {
    cd_pricing: number;
    tx_titulo: string;
    tx_icon: string;
    tx_url: string;
}

menuSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe de ser unico' });
export const Menu = model<Menu>('Menu', menuSchema);