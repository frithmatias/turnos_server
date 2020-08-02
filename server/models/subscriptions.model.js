"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const subscriptionSchema = new mongoose_1.Schema({
    ob_subscription: { type: Object, required: [true, 'El ob_subscription es necesario'] },
    fc_timestamp: { type: String, required: true, default: +new Date().getTime() },
}, { collection: "subscriptions" });
subscriptionSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Subscriptions = mongoose_1.model('Subscriptions', subscriptionSchema);
