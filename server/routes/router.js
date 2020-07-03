"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_1 = require("../classes/ticket");
const router = express_1.Router();
// TICKETS
exports.ticket = new ticket_1.Tickets(); // lo exporto para usarlo en sockets.ts.
// VIENE DE LA PANTALLA CREAR TICKETS
router.get('/nuevoticket/:id_socket', (req, res) => {
    var id_socket = String(req.params.id_socket);
    res.status(200).json({
        ok: true,
        msg: 'Ticket obtenido correctamente',
        ticket: exports.ticket.getNewTicket(id_socket)
    });
});
// VIENE DE LA PANTALLA ESCRITORIO
router.post('/atenderticket', (req, res) => {
    const { idDesk, idDeskSocket } = req.body;
    res.json(exports.ticket.atenderTicket(idDesk, idDeskSocket));
});
router.get('/pendingticket/:desk_id', (req, res) => {
    var desk_id = Number(req.params.desk_id);
    res.json(exports.ticket.getDesktopStatus(desk_id));
});
// VIENE DE LA PANTALLA PUBLICA
router.get('/gettickets', (req, res) => {
    res.json({
        ok: true,
        tickets: exports.ticket.getTickets()
    });
});
// El usuario actualizó la pantalla o perdió y recuperó la conexión.
router.put('/actualizarsocket', (req, res) => {
    const oldSocket = req.body.oldSocket;
    const newSocket = req.body.newSocket;
    let resp = exports.ticket.actualizarSocket(oldSocket, newSocket);
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
