"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_1 = require("../classes/ticket");
const server_1 = __importDefault(require("../classes/server"));
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
    const server = server_1.default.instance;
    const numTickets = exports.ticket.readPendingTickets();
    //todo: crear dos salas. Una para escritorios y otra para clientes. Este mensaje es dirigido a escritorios.
    server.io.emit('nuevo-turno', numTickets);
});
// VIENE DE LA PANTALLA ESCRITORIO
router.post('/atenderticket', (req, res) => {
    const { idDesk, idDeskSocket } = req.body;
    res.json(exports.ticket.atenderTicket(idDesk, idDeskSocket));
    // creo una misma instancia corriendo en toda la app con el patrón singleton
    const server = server_1.default.instance;
    const numTickets = exports.ticket.readPendingTickets();
    server.io.emit('actualizar-pantalla'); // para clientes
    server.io.emit('nuevo-turno', numTickets); // para asistentes
});
router.post('/devolverticket', (req, res) => {
    const { idDesk } = req.body;
    // const ticketToRollback = ticket.getDesktopStatus(idDesk);
    // const socketCli = ticketToRollback.ticket?.id_socket;
    res.json(exports.ticket.devolverTicket(idDesk));
    const server = server_1.default.instance;
    const numTickets = exports.ticket.readPendingTickets();
    server.io.emit('nuevo-turno', numTickets); // para asistentes
    server.io.emit('actualizar-pantalla'); // para clientes
});
router.post('/finalizarticket', (req, res) => {
    var _a;
    const { idDesk } = req.body;
    const ticketToEnd = exports.ticket.getDesktopStatus(idDesk);
    const socketCli = (_a = ticketToEnd.ticket) === null || _a === void 0 ? void 0 : _a.id_socket;
    res.json(exports.ticket.finalizarTicket(idDesk));
    const server = server_1.default.instance;
    // se actualiza la pantalla SOLO del cliente con el turno finalizado
    if (socketCli) {
        server.io.to(socketCli).emit('actualizar-pantalla');
    }
});
// Escritorio al conectar
router.get('/pendingticket/:desk_id', (req, res) => {
    var desk_id = Number(req.params.desk_id);
    res.json(exports.ticket.getDesktopStatus(desk_id));
});
// Pantalla pública
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
