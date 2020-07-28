import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE", "ASSISTANT_ROLE"],
    message: "{VALUE} no es un rol permitido"
  };
  
const userSchema = new Schema({
    tx_name: {type: String, required: [true, 'El nombre es necesario']},
    tx_email: {type: String, unique: true, required: [true, 'El email es necesario']},
    tx_password: {type: String, required: [true, 'El password es necesario']},
    id_company: {type: String, ref: 'Company', required: [true, 'El nombre de la empresa es necesario']},
    id_role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    id_skills: [{type: String, ref: 'Skill' , required: false}],
    tx_img: {type: String, required: false},
    bl_google: {type: Boolean, required: true, default: false},
    fc_lastlogin: { type: Date, required: false },
    fc_createdat: { type: Date, required: false }
},{ collection: "users" })

userSchema.method('checkPassword', function(this: any, pass: String = ''): boolean {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const userSchema = new Schema({})
    if (bcrypt.compareSync(pass, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface User extends Document {
    tx_name: string;
    tx_email: string;
    tx_password: string;
    id_company: string;
    id_role: string;
    id_skills: string[];
    tx_img: string;
    bl_google: boolean;
    fc_lastlogin: Date;
    fc_createdat: Date;
}

userSchema.plugin( uniqueValidator, {message: 'El campo {PATH} debe de ser unico'} );
export const User = model<User>('User', userSchema);