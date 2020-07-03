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
    cliente.on('extender-tiempo-atencion', (ticket) => {
        // cliente.to(cliente.id).emit('extender-tiempo-atencion', ticket.ticket);
    });
    cliente.on('mensaje-publico', (payload) => {
        io.emit('mensaje-publico', payload);
    });
    cliente.on('mensaje-privado', (payload) => {
        // con el socket del remitente busco en las propiedades id_socket y id_socket_desk de mi array de tickets
        // para saber quien es el destinatario, si el escritorio o el cliente.
        const todoTickets = router_1.ticket.getTickets();
        console.log('TODOS LOS TICKETS----', todoTickets);
        const myTicket = router_1.ticket.getTickets().filter(ticket => (ticket.tm_end === null) && ( // sólo el último ticket en atención sin finalizar.
        (ticket.id_socket_desk === cliente.id) ||
            (ticket.id_socket === cliente.id)))[0];
        if (!myTicket || !myTicket.id_socket || !myTicket.id_socket_desk) {
            io.to(cliente.id).emit('ATENCION: No se pudo enviar el mensaje. Verifique la conexión.');
            return;
        }
        // si mi socket corresponde a id_socket entonces soy cliente, le voy a enviar el mensaje a escritorio
        // si mi socket corresponde a id_socket_desk soy escritorio y le voy a enviar el mensaje al cliente
        const sendTo = (cliente.id === myTicket.id_socket) ? myTicket.id_socket_desk : myTicket.id_socket;
        console.log('MY-TICKET----------------', myTicket);
        console.log('mensaje a ', sendTo);
        // io.in(cliente.id).emit('mensaje-nuevo', payload);
        if (typeof (sendTo) === 'string') {
            io.to(sendTo).emit('mensaje-privado', payload);
        }
    });
};
