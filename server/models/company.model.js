"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const companySchema = new mongoose_1.Schema({
    tx_company_name: { type: String, unique: true, required: [true, 'El tx_name es necesario'] },
    tx_address_street: { type: String, required: false },
    tx_address_number: { type: String, required: false },
    cd_city: { type: String, required: false },
    fc_att_start: { type: Date, required: false },
    fc_att_end: { type: Date, required: false },
}, { collection: "companies" });
companySchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Company = mongoose_1.model('Company', companySchema);
