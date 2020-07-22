"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_controller_1 = __importDefault(require("../controllers/ticket.controller"));
// Borrar marcador
exports.escucharMensajes = (cliente, io) => {
    // Orden enviada por el cliente.
    cliente.on('cliente-en-camino', (idSocketDesk) => {
        io.to(idSocketDesk).emit('cliente-en-camino');
    });
    cliente.on('mensaje-publico', (payload) => {
        io.emit('mensaje-publico', payload);
    });
    cliente.on('mensaje-privado', (payload) => {
        const myDestination = ticket_controller_1.default.getMyDestination(cliente);
        // io.in(cliente.id).emit('mensaje-nuevo', payload);
        if (myDestination === 'error') {
            const payload = { mensaje: 'Mensaje automático: Debido a que usted aún no tiene asignado un asistente, esta consulta fue derivada a ventanilla de informes. Por favor espere, le responderemos a la brevedad. Gracias.' };
            io.to(cliente.id).emit('mensaje-privado', payload);
        }
        io.to(myDestination).emit('mensaje-privado', payload);
    });
};
