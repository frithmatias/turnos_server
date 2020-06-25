"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_1 = require("../classes/ticket");
const router = express_1.Router();
// TICKETS
const ticket = new ticket_1.Ticket();
// VIENE DE LA PANTALLA CREAR TICKETS
router.get('/nuevoticket', (req, res) => {
    res.json({
        ok: true,
        ticket: ticket.getTicketNum()
    });
});
// VIENE DE LA PANTALLA ESCRITORIO
router.get('/atenderticket/:desk_id', (req, res) => {
    var desk_id = req.params.desk_id;
    res.json({
        ok: true,
        ticket: ticket.atenderTicket(desk_id)
    });
});
// VIENE DE LA PANTALLA PUBLICA
router.get('/getalltickets', (req, res) => {
    res.json({
        ok: true,
        tickets: ticket.getAllTickets()
    });
});
// ya tengo creado mi primer servicio pero no lo puedo llamar porque este router no lo importe desde ningún lado
// lo importo desde index.ts
exports.default = router;
