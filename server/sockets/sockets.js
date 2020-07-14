"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_controller_1 = __importDefault(require("../controllers/ticket.controller"));
// Borrar marcador
exports.escucharMensajes = (cliente, io) => {
    // Orden enviada por el cliente.
    cliente.on('cliente-en-camino', () => {
        const myDestination = getMyDestination(cliente);
        io.to(myDestination).emit('cliente-en-camino');
    });
    cliente.on('mensaje-publico', (payload) => {
        io.emit('mensaje-publico', payload);
    });
    cliente.on('mensaje-privado', (payload) => {
        const myDestination = getMyDestination(cliente);
        // io.in(cliente.id).emit('mensaje-nuevo', payload);
        io.to(myDestination).emit('mensaje-privado', payload);
    });
    function getMyDestination(cliente) {
        const myTicket = ticket_controller_1.default.ticket.getTickets().filter(ticket => (ticket.tm_end === null) && ( // sólo el último ticket en atención sin finalizar.
        (ticket.id_socket_desk === cliente.id) ||
            (ticket.id_socket === cliente.id)))[0];
        if (!myTicket || !myTicket.id_socket || !myTicket.id_socket_desk) {
            errorResponse(cliente);
            return 'error';
        }
        // si mi socket corresponde a id_socket mi destino es un escritorio
        // si mi socket corresponde a id_socket_desk mi destino es un cliente
        const destination = (cliente.id === myTicket.id_socket) ? myTicket.id_socket_desk : myTicket.id_socket;
        if (typeof (destination) === 'string') {
            return destination;
        }
        else {
            errorResponse(cliente);
            return 'error';
        }
    }
    function errorResponse(cliente) {
        const payload = { mensaje: 'Mensaje automático: Debido a que usted aún no tiene asignado un asistente, esta consulta fue derivada a ventanilla de informes. Por favor espere, le responderemos a la brevedad. Gracias.' };
        io.to(cliente.id).emit('mensaje-privado', payload);
    }
};
