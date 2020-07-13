"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ticket_1 = require("../classes/ticket");
const server_1 = __importDefault(require("../classes/server"));
// TICKETS
const ticket = new ticket_1.Tickets(); // lo exporto para usarlo en sockets.ts.
function createTicket(req, res) {
    var id_socket = String(req.params.id_socket);
    res.status(200).json({
        ok: true,
        msg: 'Ticket obtenido correctamente',
        ticket: ticket.getNewTicket(id_socket)
    });
    const server = server_1.default.instance;
    const numTickets = ticket.getPendingTickets();
    //todo: crear dos salas. Una para escritorios y otra para clientes. Este mensaje es dirigido a escritorios.
    server.io.emit('nuevo-turno', numTickets);
}
;
function takeTicket(req, res) {
    const { idDesk, idDeskSocket } = req.body;
    res.json(ticket.atenderTicket(idDesk, idDeskSocket));
    // creo una misma instancia corriendo en toda la app con el patrón singleton
    const server = server_1.default.instance;
    const numTickets = ticket.getPendingTickets();
    server.io.emit('actualizar-pantalla'); // para clientes
    server.io.emit('nuevo-turno', numTickets); // para asistentes
}
;
function rejectTicket(req, res) {
    const { idDesk } = req.body;
    // const ticketToRollback = ticket.getDesktopStatus(idDesk);
    // const socketCli = ticketToRollback.ticket?.id_socket;
    res.json(ticket.devolverTicket(idDesk));
    const server = server_1.default.instance;
    const numTickets = ticket.getPendingTickets();
    server.io.emit('nuevo-turno', numTickets); // para asistentes
    server.io.emit('actualizar-pantalla'); // para clientes
}
;
function endTicket(req, res) {
    var _a;
    const { idDesk } = req.body;
    const ticketToEnd = ticket.getDesktopStatus(idDesk);
    const socketCli = (_a = ticketToEnd.ticket) === null || _a === void 0 ? void 0 : _a.id_socket;
    res.json(ticket.finalizarTicket(idDesk));
    const server = server_1.default.instance;
    // se actualiza la pantalla SOLO del cliente con el turno finalizado
    if (socketCli) {
        server.io.to(socketCli).emit('actualizar-pantalla');
    }
}
;
function getTicket(req, res) {
    var desk_id = Number(req.params.desk_id);
    res.json(ticket.getDesktopStatus(desk_id));
}
;
function getTickets(req, res) {
    res.json({
        ok: true,
        tickets: ticket.getTickets()
    });
}
;
function updateSocket(req, res) {
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
}
;
module.exports = {
    ticket,
    createTicket,
    takeTicket,
    rejectTicket,
    endTicket,
    getTicket,
    getTickets,
    updateSocket
};
