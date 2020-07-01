export interface TicketsResponse {
	ok: boolean;
	tickets: Ticket[];
}

export interface TicketResponse {
	ok: boolean;
	msg: string;
	ticket: Ticket | null;
}

export interface Ticket {
	id_ticket: number;
	id_socket: string;
	id_desk: number | null;
	tm_start: number;
	tm_att: number | null;
	tm_end: number | null;
}

