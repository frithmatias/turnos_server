"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const positionSchema = new mongoose_1.Schema({
    id_day: { type: Number, required: [true, 'El id_day es necesario'] },
    id_month: { type: Number, required: [true, 'El id_month es necesario'] },
    id_year: { type: Number, required: [true, 'El id_year es necesario'] },
    id_skill: { type: String, required: [true, 'El id_skill es necesario'] },
    id_position: { type: Number, required: [true, 'El id_position es necesario'] },
}, { collection: "position" });
exports.Position = mongoose_1.model('Position', positionSchema);
