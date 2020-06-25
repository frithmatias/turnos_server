"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_1 = require("../classes/ticket");
exports.ticket = new ticket_1.Ticket();
// Borrar marcador
exports.enviarNovedades = (cliente, io) => {
    // Orden enviada por el escritorio
    cliente.on('actualizar-pantalla', (ticket) => {
        console.log('Enviando a la pantalla pública ', ticket);
        cliente.broadcast.emit('actualizar-pantalla', ticket);
    });
};
