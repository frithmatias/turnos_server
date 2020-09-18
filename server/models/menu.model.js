"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const menuSchema = new mongoose_1.Schema({
    id_parent: { type: String, required: [true, 'El id_parent es necesario'] },
    cd_pricing: { type: Number, required: [true, 'El cd_pricing es necesario'] },
    cd_role: { type: Number, required: [true, 'El cd_role es necesario'] },
    tx_titulo: { type: String, required: [true, 'El tx_titulo es necesario'] },
    tx_icon: { type: String, required: [true, 'El tx_icon es necesario'] },
    tx_url: { type: String, required: [true, 'El tx_url es necesario'] },
}, { collection: "menus" });
menuSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Menu = mongoose_1.model('Menu', menuSchema);
