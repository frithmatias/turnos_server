"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const errorSchema = new mongoose_1.Schema({
    cd_error: { type: String, required: [true, 'El cd_error es necesario'] },
    tx_error: { type: String, required: [true, 'El tx_error es necesario'] },
}, { collection: "errors" });
errorSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Error = mongoose_1.model('Error', errorSchema);
