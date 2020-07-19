import { Request, Response } from 'express';
import Server from '../classes/server';

// MODELS
import { Ticket } from '../models/ticket.model';
import { Status } from '../models/status.model';


function createTicket(req: Request, res: Response) {
	
	// ! con findOneAndUpdate en lugar de findOne, ++, y luego save() puedo incrementar id_ticket 
	// ! antes de que otro usuario pueda solicitar un ticket en ese instante y obtener el mismo número.

	const idDay = + new Date().getDate();
	const idMonth = + new Date().getMonth() + 1;
	const idYear = + new Date().getFullYear();
	const { idSocket, typeTicket, idCompany } = req.body;

	var idTicket: number;

	Status.findOneAndUpdate({
		id_company: idCompany,
		id_type: typeTicket,
		id_year: idYear,
		id_month: idMonth,
		id_day: idDay
	},{ $inc: {id_ticket: 1}}).then((statusUpdated) => {

		if (!statusUpdated) {

			let newTicketsStatus = new Status({
				id_company: idCompany,
				id_type: typeTicket,
				id_year: idYear,
				id_month: idMonth,
				id_day: idDay,
				id_ticket: 1
			})

			newTicketsStatus.save().catch(() => {
				return res.status(400).json({
					ok: false,
					mensaje: "El nuevo status no se pudo guardar."
				});
			})

			idTicket = newTicketsStatus.id_ticket;
		}

		if (statusUpdated) {
			idTicket = statusUpdated.id_ticket;
		}

		// guardo el ticket
		let ticketDB = new Ticket({
			id_ticket: idTicket,
			id_socket: idSocket,
			id_socket_desk: null,
			id_desk: null,
			id_company: idCompany,
			id_type: typeTicket,
			tm_start: + new Date().getTime(),
			tm_att: null,
			tm_end: null
		})

		ticketDB.save().then((ticketSaved) => {

			res.status(201).json({
				ok: true,
				mensaje: "Ticket guardado correctamente.",
				ticket: ticketSaved
			});

		}).catch(() => {

			return res.status(400).json({
				ok: false,
				mensaje: "El ticket no se pudo guardar."
			});

		})
	}).catch(() => {

		return res.status(400).json({
			ok: false,
			mensaje: "Error al procesar el status de los tickets para la empresa."
		});

	})

	const server = Server.instance;
	
	console.log('enviando mensaje de bienvenida a', idSocket);
	server.io.to(idSocket).emit('mensaje-privado', { mensaje: 'Bienvenido, estamos acá para cualquier consulta. Gracias por esperar.' });

	getPendingTickets(idCompany).then(resp => {
		if (resp.ok) {
			server.io.emit('nuevo-turno', resp.num);
		}
	})
};

function cancelTicket(req: Request, res: Response) {
	const idTicket = req.params.idTicket;

	Ticket.findByIdAndUpdate({_id: idTicket}, {tm_end: + new Date().getTime()}).then((ticketFinished)=> {
		return res.status(200).json({
			ok: true,
			msg: "Ticket finalizado correctamente",
			ticket: ticketFinished
		})
	}).catch(()=>{
		return res.status(400).json({
			ok: false,
			msg: "No se pudo finalizar el ticket",
			ticket: null
		})
	})
}

function takeTicket(req: Request, res: Response) {
	const { idDesk, idType, idDeskSocket, idCompany } = req.body;

	Ticket.findOne({ id_company: idCompany, id_type: idType, tm_att: null })
		.then((ticketDB) => {
			if (!ticketDB) {
				return res.status(200).json({
					ok: false,
					msg: 'No existen tickets pendientes de resolución',
					ticket: null
				})
			}

			return res.status(200).json({
				ok: true,
				msg: 'Ticket pendiente de resolución obtenido correctamente',
				ticket: ticketDB
			})
		})
		.catch((err) => {
			return res.status(500).json({
				ok: false,
				msg: 'Error obteniendo un ticket pendiente',
				ticket: null
			})
		})

	// creo una misma instancia corriendo en toda la app con el patrón singleton

	const server = Server.instance;
	server.io.emit('actualizar-pantalla'); // para clientes

	getPendingTickets(idCompany).then(resp => {
		if (resp.ok) {
			server.io.emit('nuevo-turno', resp.num); // para asistentes
		}
	})
};

function rejectTicket(req: Request, res: Response) {
	// const { idCompany, idDesk } = req.body;
	// todo: poner a null tm_att
	// const server = Server.instance;
	// const numTickets = this.getPendingTickets(idCompany);
	// server.io.emit('nuevo-turno', numTickets); // para asistentes
	// server.io.emit('actualizar-pantalla'); // para clientes
};

function endTicket(req: Request, res: Response) {
	// const { idDesk } = req.body;
	// const ticketToEnd = getPendingTicket(idDesk);
	// const socketCli = ticketToEnd.ticket?.id_socket;
	// res.json(ticket.finalizarTicket(idDesk));
	// const server = Server.instance;
	// // se actualiza la pantalla SOLO del cliente con el turno finalizado
	// if (socketCli) { server.io.to(socketCli).emit('actualizar-pantalla'); }
};

function getPendingTicket(req: Request, res: Response) {

	var idDesk = Number(req.params.id_desk);

	Ticket.findById(idDesk).then(ticketPending => {

		if (!ticketPending) {
			return res.status(200).json({
				ok: true,
				mensaje: "No existe ticket pendiente de resolución."
			});
		}

		return res.status(200).json({
			ok: true,
			mensaje: "Existe un ticket pendiente de resolución.",
			ticket: ticketPending
		});

	}).catch((err) => {
		return res.status(400).json({
			ok: false,
			mensaje: "Error al obtener el socket del ticket."
		});
	});
	// res.json(ticket.getDesktopStatus(id_desk));
};

function getTickets(req: Request, res: Response) {
	const idCompany = req.params.id_company;
	Ticket.find({ id_company: idCompany }).then((tickets) => {
		
		if (!tickets) {
			return res.status(400).json({
				ok: false,
				msg: "No existen tickets para la empresa solicitada.",
				tickets: null
			});
		}

		return res.status(200).json({
			ok: true,
			msg: "Se encontraron tickets para la empresa solicitada.",
			tickets
		});
	}).catch((err) => {
		return res.status(500).json({
			ok: false,
			msg: "Error al obtener los tickets para la empresa solicitada.",
			tickets: null
		});
	})
};

function updateSocket(req: Request, res: Response) {

	const idTicket = req.body.idTicket;
	const newSocket = req.body.newSocket;

	Ticket.findById(idTicket).then((ticketDB) => {

		if (!ticketDB) {
			return res.status(400).json({
				ok: false,
				mensaje: "No existe el ticket con el socket a actualizar."
			});
		}

		ticketDB.id_socket = newSocket;

		ticketDB.save().then((ticketUpdated) => {
			return res.status(200).json({
				ok: true,
				mensaje: "El socket del ticket fue actualizado correctamente.",
				ticket: ticketUpdated
			});
		}).catch(() => {
			return res.status(400).json({
				ok: false,
				mensaje: "Error al actualizar el socket del ticket."
			});

		})

	}).catch(() => {
		return res.status(400).json({
			ok: false,
			mensaje: "Error al obtener el socket del ticket."
		});

	})
}

// helpers

function getMyDestination(cliente: any): any {

	return Ticket.findOne({ $or: [{ id_socket: cliente.id, tm_end: null }, { id_socket_desk: cliente.id, tm_end: null }] })
		.then((ticketDB) => {
			if (!ticketDB) return null;
			return ticketDB;
		}).catch(() => {
			return null;
		})

}

function getPendingTickets(idCompany: string) {
	return Ticket.find({ id_company: idCompany, tm_end: null })
		.then((resp) => {
			return {
				ok: true,
				num: resp.length
			}
		})
		.catch(() => {
			return {
				ok: false,
				num: 0
			}
		})
}

export = {
	createTicket,
	cancelTicket,
	takeTicket,
	rejectTicket,
	endTicket,
	getPendingTicket,
	getTickets,
	updateSocket,
	getMyDestination,
	getPendingTickets
}