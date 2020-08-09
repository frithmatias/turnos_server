import { Request, Response } from 'express';
import Server from '../classes/server';

// MODELS
import { Ticket } from '../models/ticket.model';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';

const server = Server.instance;

function createTicket(req: Request, res: Response) {

	const idDay = + new Date().getDate();
	const idMonth = + new Date().getMonth() + 1;
	const idYear = + new Date().getFullYear();
	const { idCompany, idSkill, cdSkill, idSocket } = req.body;
	var idTicket: number;

	Status.findOneAndUpdate({
		id_skill: idSkill,
		id_year: idYear,
		id_month: idMonth,
		id_day: idDay
	}, { $inc: { id_ticket: 1 } }).then((statusUpdated) => {

		if (!statusUpdated) {

			let newTicketsStatus = new Status({
				id_skill: idSkill,
				id_year: idYear,
				id_month: idMonth,
				id_day: idDay,
				id_ticket: 1
			})

			newTicketsStatus.save().catch(() => {
				return res.status(400).json({
					ok: false,
					msg: "El nuevo status no se pudo guardar."
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
			id_skill: idSkill,
			cd_skill: cdSkill,
			tm_start: + new Date().getTime(),
			tm_att: null,
			tm_end: null
		})

		ticketDB.save().then((ticketSaved) => {

			const server = Server.instance;
			server.io.to(idSocket).emit('mensaje-privado', { msg: 'Bienvenido, puede realizar culquier consulta por aquí. Gracias por esperar.' });

			getCountPending(idCompany).then(resp => {
				if (resp.ok) {
					server.io.to(idCompany).emit('nuevo-turno', resp.num);
				}
			})

			res.status(201).json({
				ok: true,
				msg: "Ticket guardado correctamente.",
				ticket: ticketSaved
			});

		}).catch(() => {

			return res.status(400).json({
				ok: false,
				msg: "El ticket no se pudo guardar."
			});

		})
	}).catch(() => {

		return res.status(400).json({
			ok: false,
			msg: "Error al procesar el status de los tickets para la empresa."
		});

	})


};

function getCountPending(idCompany: string) {
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

function takeTicket(req: Request, res: Response) {

	const server = Server.instance;
	const { cdDesk, idDesk, idSocketDesk, idAssistant } = req.body;

	User.findById(idAssistant).then(assistantDB => {

		if (!assistantDB) {
			return res.status(400).json({
				ok: false,
				msg: 'No existe el asistente!',
				assistant: null
			});
		}

		if (assistantDB) {

			// Busco un nuevo ticket para atender
			Ticket.findOne({
				id_company: assistantDB.id_company,
				id_skill: { $in: assistantDB.id_skills },
				id_desk: null,
				tm_end: null
			}).then(ticketDB => {

				if (!ticketDB) {
					return res.status(200).json({
						ok: false,
						msg: 'No existen tickets pendientes de resolución',
						ticket: null
					})
				}

				if (ticketDB) {

					ticketDB.tm_att = + new Date().getTime();
					ticketDB.id_desk = idDesk;
					ticketDB.id_socket_desk = idSocketDesk;
					ticketDB.id_assistant = idAssistant;
					ticketDB.cd_desk = cdDesk;

					ticketDB.save().then(ticketSaved => {

						server.io.to(ticketSaved.id_socket).emit('mensaje-privado', { msg: `Usted fue llamado desde el escritorio ${cdDesk} por ${assistantDB.tx_name} ` });
						//server.io.to(ticketSaved.id_company).emit('actualizar-pantalla'); // para clientes
						server.io.to(ticketSaved.id_company).emit('actualizar-pantalla'); // para clientes

						return res.status(200).json({
							ok: true,
							msg: 'Ticket obtenido correctamente',
							ticket: ticketDB
						});

					}).catch(() => {
						return res.status(400).json({
							ok: false,
							msg: 'Se encontro un ticket pero sucedió un error al actualizarlo',
							ticket: null
						});
					})

				}

			}).catch(() => {
				return res.status(500).json({
					ok: false,
					msg: 'Error al consultar el ticket',
					ticket: null
				})
			})
		}
	}).catch(() => {
		return res.status(500).json({
			ok: false,
			msg: 'Error al consultar el asistente',
			assistant: null
		})
	})









};

function cancelTicket(req: Request, res: Response) {
	const idTicket = req.params.idTicket;

	Ticket.findByIdAndUpdate({ _id: idTicket }, { tm_end: + new Date().getTime() }).then((ticketFinished) => {
		return res.status(200).json({
			ok: true,
			msg: "Ticket finalizado correctamente",
			ticket: ticketFinished
		})
	}).catch(() => {
		return res.status(400).json({
			ok: false,
			msg: "No se pudo finalizar el ticket",
			ticket: null
		})
	})
}

function releaseTicket(req: Request, res: Response) {
	const idTicket = req.body.idTicket;
	Ticket.findByIdAndUpdate(idTicket, {
		tm_att: null,
		id_desk: null,
		id_socket_desk: null,
		id_assistant: null,
		cd_desk: null
	}).then(ticketReleased => {
		if (ticketReleased?.id_company) { server.io.to(ticketReleased.id_company).emit('actualizar-pantalla'); }
		return res.status(200).json({
			ok: true,
			msg: 'Ticket soltado correctamente',
			ticket: ticketReleased
		})
	}).catch(() => {
		return res.status(400).json({
			ok: false,
			msg: 'No se pudo soltar el ticket',
			ticket: null
		})
	})
};

function endTicket(req: Request, res: Response) {
	const idTicket = req.body.idTicket;
	Ticket.findByIdAndUpdate(idTicket, { tm_end: + new Date().getTime() }).then(ticketEnded => {
		if (ticketEnded?.id_company) { server.io.to(ticketEnded.id_company).emit('actualizar-pantalla'); }
		return res.status(200).json({
			ok: true,
			msg: 'Ticket finalizado correctamente',
			ticket: ticketEnded
		})
	}).catch(() => {
		return res.status(400).json({
			ok: false,
			msg: 'No se pudo finalizar el ticket',
			ticket: null
		})
	})
};

function getTickets(req: Request, res: Response) {
	const idCompany = req.params.id_company;
	Ticket.find({ id_company: idCompany }).then((tickets) => {
		
		if (tickets.length > 0) {
			return res.status(200).json({
				ok: true,
				msg: "Se encontraron tickets para la empresa solicitada.",
				tickets
			});
		}

		return res.status(400).json({
			ok: false,
			msg: "No existen tickets para la empresa solicitada.",
			tickets: null
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
	const oldSocket = req.body.oldSocket;
	const newSocket = req.body.newSocket;

	Ticket.findById(idTicket).then((ticketDB) => {

		if (!ticketDB) {
			return res.status(400).json({
				ok: false,
				msg: "No existe el ticket con el socket a actualizar."
			});
		}

		let requestUpdateTo: string;

		switch (oldSocket) {
			case ticketDB.id_socket: // actualizo el socket del cliente
				ticketDB.id_socket = newSocket;
				if (ticketDB.id_socket_desk) { requestUpdateTo = ticketDB.id_socket_desk; }
				break;
			case ticketDB.id_socket_desk: // actualizo el socket del asistente
				ticketDB.id_socket_desk = newSocket
				requestUpdateTo = ticketDB.id_socket;
				break;
			default:
				break;
		}


		ticketDB.save().then((ticketUpdated) => {

			// antes de enviar el ticket actualizado al solicitante, tengo que 
			// avisarle a la otra parte, que tiene que actualizar el ticket. 

			server.io.to(requestUpdateTo).emit('ticket-updated', {
				ok: true,
				msg: 'El socket del destino ha cambiado',
				ticket: ticketUpdated
			});

			return res.status(200).json({
				ok: true,
				msg: "El socket del ticket fue actualizado correctamente.",
				ticket: ticketUpdated
			});



		}).catch(() => {

			return res.status(400).json({
				ok: false,
				msg: "Error al actualizar el socket del ticket."
			});

		})

	}).catch(() => {

		return res.status(400).json({
			ok: false,
			msg: "Error al obtener el socket del ticket."
		});

	})
}

export = {
	createTicket,
	cancelTicket,
	takeTicket,
	releaseTicket,
	endTicket,
	getTickets,
	updateSocket,
}