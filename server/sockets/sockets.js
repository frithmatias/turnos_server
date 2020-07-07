"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../routes/router");
// Borrar marcador
exports.escucharMensajes = (cliente, io) => {
    // Orden enviada por el escritorio
    cliente.on('actualizar-pantalla', () => {
        cliente.broadcast.emit('actualizar-pantalla');
    });
    // Orden enviada por el cliente.
    cliente.on('cliente-en-camino', (ticket) => {
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
        // Para prevenir mensajes cruzados cliente-cliente y problemas de seguridad, los mensajes son capturados 
        // y asignados solo por el backend. El cliente sólo emite el mensaje que es recibido por el backend y
        // con el socket del remitente busco en las propiedades id_socket y id_socket_desk de mi array de tickets
        // para saber quien es el destinatario, si el escritorio o el cliente.
        const myTicket = router_1.ticket.getTickets().filter(ticket => (ticket.tm_end === null) && ( // sólo el último ticket en atención sin finalizar.
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
        const payload = { mensaje: '<system> No se pudo enviar el mensaje' };
        io.to(cliente.id).emit('mensaje-privado', payload);
    }
};
