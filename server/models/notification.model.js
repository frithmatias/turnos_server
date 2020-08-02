"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const notificationSchema = new mongoose_1.Schema({
    id_company: { type: String, required: [true, 'El id_company es necesario'] },
    cd_notification: { type: String, required: [true, 'El cd_notification es necesario'] },
    tx_notification: { type: String, required: [true, 'El tx_notification es necesario'] },
}, { collection: "notifications" });
notificationSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.Notification = mongoose_1.model('Notification', notificationSchema);
