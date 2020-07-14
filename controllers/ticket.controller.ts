import { Router, Request, Response } from 'express';
import { Tickets } from '../classes/ticket';
import Server from '../classes/server';

// TICKETS
const ticket = new Tickets(); // lo exporto para usarlo en sockets.ts.

function createTicket(req: Request, res: Response) {
	var id_socket = String(req.params.id_socket);
	res.status(200).json({
		ok: true,
		msg: 'Ticket obtenido correctamente',
		ticket: ticket.getNewTicket(id_socket)
	});

	const server = Server.instance;
	const numTickets = ticket.getPendingTickets();
	//todo: crear dos salas. Una para escritorios y otra para clientes. Este mensaje es dirigido a escritorios.
	server.io.emit('nuevo-turno', numTickets);
	console.log('enviando mensaje de bienvenida a', id_socket);
	server.io.to(id_socket).emit('mensaje-privado', { mensaje: 'Bienvenido, estamos acá para cualquier consulta. Gracias por esperar.'});
};

function takeTicket(req: Request, res: Response) {
	const { idDesk, idDeskSocket } = req.body;
	res.json(ticket.atenderTicket(idDesk, idDeskSocket));
	// creo una misma instancia corriendo en toda la app con el patrón singleton
	const server = Server.instance;
	const numTickets = ticket.getPendingTickets();
	server.io.emit('actualizar-pantalla'); // para clientes
	server.io.emit('nuevo-turno', numTickets); // para asistentes
};

function rejectTicket(req: Request, res: Response) {
	const { idDesk } = req.body;
	// const ticketToRollback = ticket.getDesktopStatus(idDesk);
	// const socketCli = ticketToRollback.ticket?.id_socket;
	res.json(ticket.devolverTicket(idDesk));
	const server = Server.instance;
	const numTickets = ticket.getPendingTickets();
	server.io.emit('nuevo-turno', numTickets); // para asistentes
	server.io.emit('actualizar-pantalla'); // para clientes
};

function endTicket(req: Request, res: Response) {
	const { idDesk } = req.body;
	const ticketToEnd = ticket.getDesktopStatus(idDesk);
	const socketCli = ticketToEnd.ticket?.id_socket;
	res.json(ticket.finalizarTicket(idDesk));
	const server = Server.instance;
	// se actualiza la pantalla SOLO del cliente con el turno finalizado
	if (socketCli) { server.io.to(socketCli).emit('actualizar-pantalla'); }
};

function getTicket(req: Request, res: Response) {
	var desk_id = Number(req.params.desk_id);
	res.json(ticket.getDesktopStatus(desk_id));
};

function getTickets(req: Request, res: Response) {
	res.json({
		ok: true,
		tickets: ticket.getTickets()
	});
};

function updateSocket(req: Request, res: Response) {
	const oldSocket = req.body.oldSocket;
	const newSocket = req.body.newSocket;
	let resp = ticket.actualizarSocket(oldSocket, newSocket);
	if (!resp) {
		res.status(400).json({
			ok: false,
			msg: 'No existe el turno con el socket indicado'
		})
	} else {
		res.status(200).json({
			ok: true,
			msg: 'El socket se actualizó correctamente'
		})
	}

};

export = {
	ticket,
	createTicket,
	takeTicket,
	rejectTicket,
	endTicket,
	getTicket,
	getTickets,
	updateSocket
}
