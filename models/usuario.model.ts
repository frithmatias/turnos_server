import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol permitido"
  };
  
const usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique: true, required: [true, 'El email es necesario']},
    password: {type: String, required: [true, 'El password es necesario']},
    empresa: {type: String, required: [true, 'El nombre de la empresa es necesario']},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    img: {type: String, required: false},
    google: {type: Boolean, required: true, default: false},
    lastlogin: { type: Date, required: false },
    createdat: { type: Date, required: false }
})

usuarioSchema.method('checkPassword', function(this: any, pass: String = ''): boolean {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const usuarioSchema = new Schema({})
    if (bcrypt.compareSync(pass, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface Usuario extends Document {
    nombre: string;
    email: string;
    password: string;
    empresa: string;
    role: string;
    img: string;
    google: boolean;
    lastlogin: Date;
    createdat: Date;
}

usuarioSchema.plugin( uniqueValidator, {message: 'El campo {PATH} debe de ser unico'} );
export const Usuario = model<Usuario>('Usuario', usuarioSchema);