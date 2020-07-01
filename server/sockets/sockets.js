"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_1 = require("../classes/ticket");
exports.ticket = new ticket_1.createTicket();
// Borrar marcador
exports.escucharMensajes = (cliente, io) => {
    // Orden enviada por el escritorio
    cliente.on('actualizar-pantalla', () => {
        cliente.broadcast.emit('actualizar-pantalla');
    });
    // Orden enviada por el cliente.
    cliente.on('extender-tiempo-atencion', (ticket) => {
        // cliente.to(cliente.id).emit('extender-tiempo-atencion', ticket.ticket);
    });
};
