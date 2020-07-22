import { Request, Response } from 'express';
import Server from '../classes/server';

// MODELS
import { Ticket } from '../models/ticket.model';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';


function createTicket(req: Request, res: Response) {
	
	// ! con findOneAndUpdate en lugar de findOne, ++, y luego save() puedo incrementar id_ticket 
	// ! antes de que otro usuario pueda solicitar un ticket en ese instante y obtener el mismo número.

	const idDay = + new Date().getDate();
	const idMonth = + new Date().getMonth() + 1;
	const idYear = + new Date().getFullYear();
	const { idSocket, idSkill, idCompany } = req.body;

	var idTicket: number;

	Status.findOneAndUpdate({
		id_company: idCompany,
		id_skill: idSkill,
		id_year: idYear,
		id_month: idMonth,
		id_day: idDay
	},{ $inc: {id_ticket: 1}}).then((statusUpdated) => {

		if (!statusUpdated) {

			let newTicketsStatus = new Status({
				id_company: idCompany,
				id_skill: idSkill,
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
			id_skill: idSkill,
			tm_start: + new Date().getTime(),
			tm_att: null,
			tm_end: null
		})

		ticketDB.save().then((ticketSaved) => {

			const server = Server.instance;
			server.io.to(idSocket).emit('mensaje-privado', { mensaje: 'Bienvenido, estamos acá para cualquier consulta. Gracias por esperar.' });
		
			getPendingTickets(idCompany).then(resp => {
				if (resp.ok) {
					server.io.emit('nuevo-turno', resp.num);
				}
			})
			
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


};

function readPendingTicket(req: Request, res: Response) {

	var idCompany = req.params.idCompany;
	var idDesk = req.params.idDesk;

	Ticket.findOne({id_company: idCompany, id_desk: idDesk}).then(ticketPending => {

		if (!ticketPending) {
			return res.status(200).json({
				ok: true,
				msg: "No existe ticket pendiente de resolución."
			});
		}

		return res.status(200).json({
			ok: true,
			msg: "Existe un ticket pendiente de resolución.",
			ticket: ticketPending
		});

	}).catch((err) => {
		return res.status(400).json({
			ok: false,
			msg: "Error al obtener el socket del ticket."
		});
	});
};

function takeTicket(req: Request, res: Response) {
	const server = Server.instance;
	const { idDesk, idSocketDesk, idAssistant} = req.body;

	User.findById(idAssistant).then( assistantDB => {

		if(!assistantDB){
			return res.status(400).json({
				ok: false,
				msg: 'No existe el asistente!',
				assistant: null
			});
		}

		if(assistantDB){

			
			// Cierro, Si existe, el ticket recientemente atendido por el escritorio.
			Ticket.findOne({id_company: assistantDB.id_company, id_desk: idDesk, tm_end: null}).then(ticketDB => {
			
				if(ticketDB){
					ticketDB.tm_end = + new Date().getTime();
					ticketDB.save().then(()=>{
						// actualiza sólo la pantalla del cliente con el turno finalizado
						server.io.to(ticketDB.id_socket).emit('actualizar-pantalla'); 
					}).catch(()=>{
						return res.status(500).json({
							ok: false,
							msg: 'Ocurrio un error al cerrar el ticket anterior.',
							ticket: ticketDB
						})
					})
				}
			})

			// Busco un nuevo ticket para atender
			Ticket.findOne({id_company: assistantDB.id_company, id_desk: null, tm_end: null}).then(ticketDB => {

				if(!ticketDB){
					return res.status(200).json({
						ok: false,
						msg: 'No existen tickets pendientes de resolución',
						ticket: null
					})
				}

				if(ticketDB){

					ticketDB.tm_att = + new Date().getTime();
					ticketDB.id_desk = idDesk;
					ticketDB.id_socket_desk = idSocketDesk;

					ticketDB.save().then(ticketSaved => {


	 					server.io.to(ticketSaved.id_socket).emit('mensaje-privado', { mensaje: 'Bienvenido, estamos acá para cualquier consulta. Gracias por esperar.' });
						//server.io.to(ticketSaved.id_company).emit('actualizar-pantalla'); // para clientes
						server.io.emit('actualizar-pantalla'); // para clientes
						
						return res.status(200).json({
							ok: true,
							msg: 'Ticket obtenido correctamente',
							ticket: ticketDB
						});

					}).catch(()=>{
						return res.status(400).json({
							ok: false,
							msg: 'Se encontro un ticket pero sucedió un error al actualizarlo',
							ticket: null
						});		
					})

				}

			}).catch(()=> {
				return res.status(500).json({
					ok: false,
					msg: 'Error al consultar el ticket',
					ticket: null
				})
			})
		}
	}).catch(()=> {
		return res.status(500).json({
			ok:false,
			msg: 'Error al consultar el asistente',
			assistant: null
		})
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
	readPendingTicket,
	getTickets,
	updateSocket,
	getMyDestination,
	getPendingTickets
}