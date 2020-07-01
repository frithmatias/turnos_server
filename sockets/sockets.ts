import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { createTicket } from '../classes/ticket';
import { TicketResponse } from '../interfaces/ticket.interface';
export const ticket = new createTicket();

// Borrar marcador
export const escucharMensajes = (cliente: Socket, io: socketIO.Server) => {
	// Orden enviada por el escritorio
	cliente.on('actualizar-pantalla', () => {
		cliente.broadcast.emit('actualizar-pantalla');
	});

	// Orden enviada por el cliente.
	cliente.on('extender-tiempo-atencion', (ticket: TicketResponse) => {
		// cliente.to(cliente.id).emit('extender-tiempo-atencion', ticket.ticket);
	});
};
