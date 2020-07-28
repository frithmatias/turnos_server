"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statusSchema = new mongoose_1.Schema({
    id_day: { type: Number, required: [true, 'El id_day es necesario'] },
    id_month: { type: Number, required: [true, 'El id_month es necesario'] },
    id_year: { type: Number, required: [true, 'El id_year es necesario'] },
    id_skill: { type: String, required: [true, 'El id_skill es necesario'] },
    id_ticket: { type: Number, required: [true, 'El id_ticket es necesario'] },
}, { collection: "status" });
exports.Status = mongoose_1.model('Status', statusSchema);
