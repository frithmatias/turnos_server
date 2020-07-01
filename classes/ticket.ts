import { Ticket, TicketResponse } from '../interfaces/ticket.interface';
import { ticket } from '../sockets/sockets';

const TIME_TO_NEXT = 500;

export class createTicket {
	private ticket_id: number = 0;
	private tickets: Ticket[] = [];
	private tktRes: TicketResponse | undefined;

	constructor() { }

	// VIENE DE LA PANTALLA CREAR TICKETS
	public getNewTicket(id_socket: string) {
		this.ticket_id++; // próximo ticket a atender.
		const ticket: Ticket = {
			id_ticket: this.ticket_id,
			id_socket: id_socket,
			id_desk: null,
			tm_start: new Date().getTime(),
			tm_att: null,
			tm_end: null
		};
		this.tickets.push(ticket);
		return ticket; 
	}

	public getTickets(id_ticket: number) {
		let newTickets: Ticket[] = [ ... this.tickets ];
		for ( let ticket of newTickets ) {
			if ( ticket.id_ticket !== id_ticket ) {
				ticket.id_socket = 'oops! :)'
			}
		}
		return newTickets;
		// return this.tickets;
	}

	public getDesktopStatus(id_desk: number) {
		let resp: TicketResponse;
		let pendingTicket = this.tickets.filter(ticket => ticket.id_desk == id_desk && ticket.tm_att !== null && ticket.tm_end === null)
		if (pendingTicket[0]) {
			resp = { ok: true, msg: 'Se encontró un ticket pendiente de resolución', ticket: pendingTicket[0] }
			return resp;
		} else {
			resp = { ok: false, msg: 'No se encontró un ticket pendiente de resolución', ticket: null }
			return resp;
		}
	}

	public atenderTicket(id_desk: number) {
		if (this.tickets.length === 0) {
			this.tktRes = {
				ok: false,
				msg: 'No existen tickets en espera',
				ticket: null
			};
			return this.tktRes;
		}

		for (let ticket of this.tickets) {
			// el recientemente llamado desde el mismo escritorio fue atenedido
			if (ticket.tm_att !== null && ticket.tm_end === null && ticket.id_desk == id_desk) {
				// si el escritorio pide atender un nuevo cliente, debe esperar 1 minuto 
				// a partir del momento en el que fue llamado.
				let now = new Date().getTime();
				if (ticket.tm_end === null && ticket.tm_att != null && (now - ticket.tm_att < TIME_TO_NEXT)) {
					let response: TicketResponse = {
						ok: false,
						msg: 'Para atender otro reclamo debe esperar al menos 1 minuto',
						ticket: null
					}
					return response;
				}
				ticket.tm_end = new Date().getTime();
			}

			// el siguiente en espera es atendido
			if (ticket.tm_att === null) {
				ticket.tm_att = new Date().getTime();
				ticket.id_desk = id_desk;
				this.tktRes = {
					ok: true,
					msg: 'Ticket en espera encontrado',
					ticket
				};
				return this.tktRes;
			}
		}

		// Se barrio el total de tickets y no hay ninguno en espera
		this.tktRes = {
			ok: false,
			msg: 'Todos los tickets fueron atendidos',
			ticket: null
		};
		return this.tktRes;
	}

	actualizarSocket(old_socket: string, new_socket: string) {
		console.log(old_socket, new_socket)
		let ticket: Ticket = this.tickets.filter(ticket => ticket.id_socket === old_socket)[0];
		if( ticket ) {
			ticket.id_socket = new_socket;
			return true;
		} else {
			return false;
		}
	} 
}



