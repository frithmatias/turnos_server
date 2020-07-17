"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var rolesValidos = {
    values: ["ADMIN_ROLE", "CLIENT_ROLE", "ASSISTANT_ROLE"],
    message: "{VALUE} no es un rol permitido"
};
const clientSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    empresa: { type: String, required: [true, 'El nombre de la empresa es necesario'] },
    role: { type: String, required: true, default: 'CLIENT_ROLE', enum: rolesValidos },
    img: { type: String, required: false },
    google: { type: Boolean, required: true, default: false },
    lastlogin: { type: Date, required: false },
    createdat: { type: Date, required: false }
}, { collection: "clients" });
clientSchema.method('checkPassword', function (pass = '') {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const clientSchema = new Schema({})
    if (bcrypt_1.default.compareSync(pass, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
clientSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Client = mongoose_1.model('Client', clientSchema);
