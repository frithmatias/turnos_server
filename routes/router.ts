import { Router, Request, Response, response } from 'express';
import Server from '../classes/server';
import { Socket } from 'net';
import { request } from 'http';
import { Ticket } from '../classes/ticket';

const router = Router();

// TICKETS
const ticket = new Ticket();

// VIENE DE LA PANTALLA CREAR TICKETS
router.get('/nuevoticket', (req: Request, res: Response) => {
	res.json({
		ok: true,
		ticket: ticket.getTicketNum()
	});
});

// VIENE DE LA PANTALLA ESCRITORIO
router.get('/atenderticket/:desk_id', (req: Request, res: Response) => {
	var desk_id = req.params.desk_id;
	res.json({
		ok: true,
		ticket: ticket.atenderTicket(desk_id)
	});
});

// VIENE DE LA PANTALLA PUBLICA
router.get('/getalltickets', (req: Request, res: Response) => {
	res.json({
		ok: true,
		tickets: ticket.getAllTickets()
	});
});

// ya tengo creado mi primer servicio pero no lo puedo llamar porque este router no lo importe desde ningún lado
// lo importo desde index.ts

export default router;
