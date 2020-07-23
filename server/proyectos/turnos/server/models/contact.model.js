"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const contactSchema = new mongoose_1.Schema({
    tx_contact: { type: String, required: [true, 'El cd_contact es necesario'] },
    tx_message: { type: String, required: [true, 'El tx_message es necesario'] },
    tx_name: { type: String, required: false },
    tx_email: { type: String, required: false },
    tx_phone: { type: String, required: false },
}, { collection: "contacts" });
contactSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Contact = mongoose_1.model('Contact', contactSchema);
