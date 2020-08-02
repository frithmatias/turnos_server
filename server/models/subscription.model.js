"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const subscriptionSchema = new mongoose_1.Schema({
    endpoint: { type: String, required: [true, 'El ob_subscription es necesario'] },
    expirationTime: { type: String, required: false },
    keys: {
        p256dh: { type: String, required: false },
        auth: { type: String, required: false }
    }
}, { collection: "subscriptions" });
subscriptionSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Subscription = mongoose_1.model('Subscription', subscriptionSchema);
