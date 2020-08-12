"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statusSchema = new mongoose_1.Schema({
    id_ticket: { type: String, ref: 'Ticket', required: [true, 'El id_ticket es necesario'] },
    cd_score: { type: Number, required: [true, 'El cd_score es necesario'] },
}, { collection: "scores" });
exports.Score = mongoose_1.model('Score', statusSchema);
