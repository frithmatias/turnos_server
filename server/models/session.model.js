"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    id_desktop: { type: String, ref: 'Desktop', required: [true, 'El desktop es necesario'] },
    id_assistant: { type: String, ref: 'User', required: [true, 'El usuario es necesario'] },
    fc_start: { type: Number, required: true, default: +new Date().getTime() },
    fc_end: { type: Number, required: false, default: null },
}, { collection: "sessions" });
exports.Session = mongoose_1.model('Session', sessionSchema);
