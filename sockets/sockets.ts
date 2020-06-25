import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { Ticket } from '../classes/ticket';
export const ticket = new Ticket();

// Borrar marcador
export const enviarNovedades = (cliente: Socket, io: socketIO.Server) => {
	// Orden enviada por el escritorio
	cliente.on('actualizar-pantalla', (ticket) => {
		console.log('Enviando a la pantalla pública ', ticket);
		cliente.broadcast.emit('actualizar-pantalla', ticket);
	});
};
