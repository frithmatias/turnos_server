"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var rolesValidos = {
    values: ["SUPERUSER_ROLE", "ADMIN_ROLE", "ASSISTANT_ROLE"],
    message: "{VALUE} no es un rol permitido"
};
const userSchema = new mongoose_1.Schema({
    tx_name: { type: String, required: [true, 'El nombre es necesario'] },
    tx_email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    tx_password: { type: String, required: [true, 'El password es necesario'] },
    id_company: { type: String, ref: 'Company', required: false },
    tx_role: { type: String, required: [true, 'El rol del usuario es necesario'] },
    cd_pricing: { type: Number, ref: 'Pricing', required: false, default: 0 },
    id_skills: [{ type: String, ref: 'Skill', required: false }],
    tx_img: { type: String, required: false },
    bl_google: { type: Boolean, required: true, default: false },
    fc_lastlogin: { type: Date, required: false },
    fc_createdat: { type: Date, required: false }
}, { collection: "users" });
userSchema.method('checkPassword', function (pass = '') {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const userSchema = new Schema({})
    if (bcrypt_1.default.compareSync(pass, this.tx_password)) {
        return true;
    }
    else {
        return false;
    }
});
userSchema.method('getData', function () {
    // Aca es muy importante NO USAR función de flecha sino una función tradicional
    // para no perder la referencia al THIS que apunta al objeto const userSchema = new Schema({})
    const _a = this.toJSON(), { __v, _id, tx_password } = _a, object = __rest(_a, ["__v", "_id", "tx_password"]);
    object.uid = _id;
    return object;
});
userSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.User = mongoose_1.model('User', userSchema);
