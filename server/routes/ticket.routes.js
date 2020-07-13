"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const ticket_controller_1 = __importDefault(require("../controllers/ticket.controller"));
// ROUTES
const ticketRoutes = express_1.Router();
// public requests
ticketRoutes.get('/nuevoticket/:id_socket', ticket_controller_1.default.createTicket);
ticketRoutes.get('/gettickets', ticket_controller_1.default.getTickets);
ticketRoutes.put('/actualizarsocket', ticket_controller_1.default.updateSocket);
// desktop requests
ticketRoutes.post('/atenderticket', auth_1.default.verificaToken, ticket_controller_1.default.takeTicket);
ticketRoutes.post('/devolverticket', auth_1.default.verificaToken, ticket_controller_1.default.rejectTicket);
ticketRoutes.post('/finalizarticket', auth_1.default.verificaToken, ticket_controller_1.default.endTicket);
ticketRoutes.get('/pendingticket/:desk_id', auth_1.default.verificaToken, ticket_controller_1.default.getTicket);
exports.default = ticketRoutes;
