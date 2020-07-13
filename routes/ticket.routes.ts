import { Router, Request, Response } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import TicketController from '../controllers/ticket.controller';

// ROUTES
const ticketRoutes = Router();

// public requests
ticketRoutes.get('/nuevoticket/:id_socket', TicketController.createTicket);
ticketRoutes.get('/gettickets', TicketController.getTickets);
ticketRoutes.put('/actualizarsocket', TicketController.updateSocket);

// desktop requests
ticketRoutes.post('/atenderticket', mdAuth.verificaToken, TicketController.takeTicket);
ticketRoutes.post('/devolverticket', mdAuth.verificaToken, TicketController.rejectTicket);
ticketRoutes.post('/finalizarticket', mdAuth.verificaToken, TicketController.endTicket);
ticketRoutes.get('/pendingticket/:desk_id', mdAuth.verificaToken, TicketController.getTicket);

export default ticketRoutes;