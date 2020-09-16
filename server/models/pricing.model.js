"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const pricingSchema = new mongoose_1.Schema({
    cd_pricing: { type: Number, required: [true, 'El cd_pricing es necesario'] },
    tx_pricing: { type: String, required: [true, 'El tx_pricing es necesario'] },
}, { collection: "pricings" });
pricingSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Pricing = mongoose_1.model('Pricing', pricingSchema);
