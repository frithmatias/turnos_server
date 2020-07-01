"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_1 = require("../classes/ticket");
const router = express_1.Router();
// TICKETS
const ticket = new ticket_1.createTicket();
// VIENE DE LA PANTALLA CREAR TICKETS
router.get('/nuevoticket/:id_socket', (req, res) => {
    var id_socket = String(req.params.id_socket);
    res.status(200).json({
        ok: true,
        msg: 'Ticket obtenido correctamente',
        ticket: ticket.getNewTicket(id_socket)
    });
});
// VIENE DE LA PANTALLA ESCRITORIO
router.get('/atenderticket/:id_desk', (req, res) => {
    var id_desk = Number(req.params.id_desk);
    res.json(ticket.atenderTicket(id_desk));
});
router.get('/pendingticket/:desk_id', (req, res) => {
    var desk_id = Number(req.params.desk_id);
    res.json(ticket.getDesktopStatus(desk_id));
});
// VIENE DE LA PANTALLA PUBLICA
router.get('/gettickets/:id_ticket', (req, res) => {
    var id_ticket = Number(req.params.id_ticket);
    res.json({
        ok: true,
        tickets: ticket.getTickets(id_ticket)
    });
});
// El usuario actualizó la pantalla o perdió y recuperó la conexión.
router.put('/actualizarsocket', (req, res) => {
    const oldSocket = req.body.oldSocket;
    const newSocket = req.body.newSocket;
    let resp = ticket.actualizarSocket(oldSocket, newSocket);
    if (!resp) {
        res.status(400).json({
            ok: false,
            msg: 'No existe el turno con el socket indicado'
        });
    }
    else {
        res.status(200).json({
            ok: true,
            msg: 'El socket se actualizó correctamente'
        });
    }
});
// ya tengo creado mi primer servicio pero no lo puedo llamar porque este router no lo importe desde ningún lado
// lo importo desde index.ts
exports.default = router;
