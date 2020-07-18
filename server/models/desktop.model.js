"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const desktopSchema = new mongoose_1.Schema({
    id_company: { type: String, required: [true, 'El id_company es necesario'] },
    id_desktop: { type: String, unique: true, required: [true, 'El id_desktop es necesario'] },
    id_type: { type: String, required: false },
    fc_from: { type: Date, required: false },
    fc_to: { type: Date, required: false },
}, { collection: "desktops" });
desktopSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Desktop = mongoose_1.model('Desktop', desktopSchema);
