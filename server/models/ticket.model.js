"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ticketsSchema = new mongoose_1.Schema({
    id_root: { type: String, ref: 'Ticket', required: false },
    id_child: { type: String, ref: 'Ticket', required: false, default: false },
    bl_priority: { type: Boolean, required: false },
    id_position: { type: Number, required: [true, 'El id del ticket es necesario'] },
    id_socket: { type: String, required: [true, 'El socket del cliente en el ticket es necesario'] },
    id_socket_desk: { type: String, required: false },
    id_session: { type: String, ref: 'Session', required: false },
    id_company: { type: String, ref: 'Company', required: [true, 'El id de la empresa es necesario'] },
    id_skill: { type: String, ref: 'Skill', required: [true, 'El id del skill es necesario'] },
    tm_start: { type: Number, required: true, default: +new Date().getTime() },
    tm_att: { type: Number, required: false },
    tm_end: { type: Number, required: false },
}, { collection: "tickets" });
exports.Ticket = mongoose_1.model('Ticket', ticketsSchema);
