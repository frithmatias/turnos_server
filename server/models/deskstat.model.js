"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deskStatSchema = new mongoose_1.Schema({
    id_desktop: { type: String, required: [true, 'El id_desktop es necesario'] },
    id_assistant: { type: String, required: false, default: null },
    fc_start: { type: Number, required: true, default: +new Date().getTime() },
    fc_end: { type: Number, required: false, default: null },
}, { collection: "deskstats" });
exports.DeskStat = mongoose_1.model('DeskStat', deskStatSchema);
