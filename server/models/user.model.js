"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE", "ASSISTANT_ROLE"],
    message: "{VALUE} no es un rol permitido"
};
const userSchema = new mongoose_1.Schema({
    tx_name: { type: String, required: [true, 'El nombre es necesario'] },
    tx_email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    tx_password: { type: String, required: [true, 'El password es necesario'] },
    id_company: { type: String, required: [true, 'El nombre de la empresa es necesario'] },
    id_role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    id_type: { type: String, required: false },
    tx_img: { type: String, required: false },
    bl_google: { type: Boolean, required: true, default: false },
    fc_lastlogin: { type: Date, required: false },
    fc_createdat: { type: Date, required: false }
}, { collection: "users" });
userSchema.method('checkPassword', function (pass = '') {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const userSchema = new Schema({})
    if (bcrypt_1.default.compareSync(pass, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
userSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.User = mongoose_1.model('User', userSchema);
