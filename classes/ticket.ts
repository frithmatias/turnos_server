export class Ticket {
	private ticket_id: number = 1;
	private tickets: Tkt[] = [];

	constructor() {}

	// REST API

	// VIENE DE LA PANTALLA CREAR TICKETS
	public getTicketNum() {
		/*
        ES Espera 
        LL Llamado 
        AT Atendido
        PR Prescrito (cuando es llamado 3 veces)
        */

		const tiket: Tkt = { id_ticket: this.ticket_id, id_desk: 0, status: 'ES' };
		//this.tickets.push(tiket);
		this.tickets[this.ticket_id] = tiket;
		console.log(this.tickets[this.ticket_id]);

		let id_tkt = this.ticket_id; // último ticket

		this.ticket_id++; // próximo ticket a atender
		return {
			id_ticket: id_tkt
		};
	}

	public getAllTickets() {
		let atendidos = [];

		const num = this.tickets.length;
		console.log(this.tickets);

		// for (let i = 0; i < num; i++) {
		// 	if (this.tickets[i].id_desk != 0) {
		// 		atendidos.push(this.tickets[i]);
		// 	}
		// }
		return this.tickets;
	}

	// VIENE DE LA PANTALLA ESCRITORIO
	public atenderTicket(id_desk: number) {
		console.log('id_desk', id_desk);
		for (var i = 1; i < this.ticket_id; i++) {
			// SE LLAMA AL SIGUIENTE EN ESPERA
			if (this.tickets[i].status === 'ES') {
				// cliente.broadcast.emit('escuchar-turnos', id);
				const ticket = {
					id_ticket: i,
					id_desk: Number(id_desk),
					status: 'LL'
				};
				this.tickets[i] = ticket;

				console.log('tickets', this.tickets);

				return this.tickets[i];
			}

			console.log('ticket', this.tickets[i]);
			console.log('id_desk en tickets', this.tickets[i].id_desk);
			console.log('id_desk en escritorio', id_desk);
			// LLAMADO RECIENTE SE PASA A ATENDIDO
			if (this.tickets[i].status === 'LL' && this.tickets[i].id_desk == id_desk) {
				this.tickets[i].status = 'AT';
			}

			if (i == this.ticket_id) {
				// Se barrio el total de tickets y no hay ninguno en espara 'ES'
				return false;
			}
		}
		console.log(this.tickets);
		// 	//Si el estado del ticket es llamado y tiene número de escirtorio lo cierro como atendido.

		// 	if (this.tickets[i]['status'] === 'LL' && this.tickets[i]['desk'] === id_desk) {
		// 		this.tickets[i]['status'] = 'AT';
		// 	}

		// 	// Si el estado es ESPERA lo vuelco a la bandeja llamados.

		// 	if (i == this.ticket_id) {
		// 		// Se barrio el total de tickets y no hay ninguno en espara 'ES'
		// 		return false;
		// 	}
		// }
	}
}

export interface Tkt {
	id_ticket?: number;
	id_desk?: number;
	status?: string;
}
