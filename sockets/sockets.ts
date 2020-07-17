import { Socket } from 'socket.io';
import socketIO from 'socket.io';

import ticketController from '../controllers/ticket.controller';
import { ITicket } from '../interfaces/ticket.interface';


// Borrar marcador
export const escucharMensajes = (cliente: Socket, io: socketIO.Server) => {

	// Orden enviada por el cliente.
	cliente.on('cliente-en-camino', () => {
		const myDestination = ticketController.getMyDestination(cliente);
		io.to(myDestination).emit('cliente-en-camino');
	});

	cliente.on('mensaje-publico', (payload: { de: string, cuerpo: string }) => {
		io.emit('mensaje-publico', payload);
	});

	cliente.on('mensaje-privado', (payload: { mensaje: string }) => {
		const myDestination = ticketController.getMyDestination(cliente);
		// io.in(cliente.id).emit('mensaje-nuevo', payload);
		if( myDestination === 'error') {
			const payload = {mensaje: 'Mensaje automático: Debido a que usted aún no tiene asignado un asistente, esta consulta fue derivada a ventanilla de informes. Por favor espere, le responderemos a la brevedad. Gracias.'}
			io.to(cliente.id).emit('mensaje-privado', payload);
		}
		io.to(myDestination).emit('mensaje-privado', payload);
		
	});



};

