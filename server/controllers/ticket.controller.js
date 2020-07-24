"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("../classes/server"));
// MODELS
const ticket_model_1 = require("../models/ticket.model");
const status_model_1 = require("../models/status.model");
const user_model_1 = require("../models/user.model");
const server = server_1.default.instance;
function createTicket(req, res) {
    // ! con findOneAndUpdate en lugar de findOne, ++, y luego save() puedo incrementar id_ticket 
    // ! antes de que otro usuario pueda solicitar un ticket en ese instante y obtener el mismo número.
    const idDay = +new Date().getDate();
    const idMonth = +new Date().getMonth() + 1;
    const idYear = +new Date().getFullYear();
    const { idCompany, idSkill, cdSkill, idSocket } = req.body;
    var idTicket;
    status_model_1.Status.findOneAndUpdate({
        id_company: idCompany,
        id_skill: idSkill,
        id_year: idYear,
        id_month: idMonth,
        id_day: idDay
    }, { $inc: { id_ticket: 1 } }).then((statusUpdated) => {
        if (!statusUpdated) {
            let newTicketsStatus = new status_model_1.Status({
                id_company: idCompany,
                id_skill: idSkill,
                id_year: idYear,
                id_month: idMonth,
                id_day: idDay,
                id_ticket: 1
            });
            newTicketsStatus.save().catch(() => {
                return res.status(400).json({
                    ok: false,
                    msg: "El nuevo status no se pudo guardar."
                });
            });
            idTicket = newTicketsStatus.id_ticket;
        }
        if (statusUpdated) {
            idTicket = statusUpdated.id_ticket;
        }
        // guardo el ticket
        let ticketDB = new ticket_model_1.Ticket({
            id_ticket: idTicket,
            id_socket: idSocket,
            id_socket_desk: null,
            id_desk: null,
            id_company: idCompany,
            id_skill: idSkill,
            cd_skill: cdSkill,
            tm_start: +new Date().getTime(),
            tm_att: null,
            tm_end: null
        });
        ticketDB.save().then((ticketSaved) => {
            const server = server_1.default.instance;
            server.io.to(idSocket).emit('mensaje-privado', { msg: 'Bienvenido, estamos acá para cualquier consulta. Gracias por esperar.' });
            readPendingTickets(idCompany).then(resp => {
                if (resp.ok) {
                    server.io.emit('nuevo-turno', resp.num);
                }
            });
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
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: "Error al procesar el status de los tickets para la empresa."
        });
    });
}
;
function readPendingTicket(req, res) {
    var idDesk = req.params.idDesk;
    ticket_model_1.Ticket.findOne({ id_desk: idDesk, tm_end: null }).then(ticketPending => {
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
            msg: "Error al buscar ticket pendiente."
        });
    });
}
;
function readPendingTickets(idCompany) {
    return ticket_model_1.Ticket.find({ id_company: idCompany, tm_end: null })
        .then((resp) => {
        return {
            ok: true,
            num: resp.length
        };
    })
        .catch(() => {
        return {
            ok: false,
            num: 0
        };
    });
}
function takeTicket(req, res) {
    const server = server_1.default.instance;
    const { cdDesk, idDesk, idSocketDesk, idAssistant } = req.body;
    user_model_1.User.findById(idAssistant).then(assistantDB => {
        if (!assistantDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el asistente!',
                assistant: null
            });
        }
        if (assistantDB) {
            // Cierro, Si existe, el ticket recientemente atendido por el escritorio.
            ticket_model_1.Ticket.findOne({ id_company: assistantDB.id_company, id_desk: idDesk, tm_end: null }).then(ticketDB => {
                if (ticketDB) {
                    ticketDB.tm_end = +new Date().getTime();
                    ticketDB.save().then(() => {
                        // actualiza sólo la pantalla del cliente con el turno finalizado
                        server.io.to(ticketDB.id_socket).emit('actualizar-pantalla');
                    }).catch(() => {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Ocurrio un error al cerrar el ticket anterior.',
                            ticket: ticketDB
                        });
                    });
                }
            });
            // Busco un nuevo ticket para atender
            ticket_model_1.Ticket.findOne({
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
                    });
                }
                if (ticketDB) {
                    ticketDB.tm_att = +new Date().getTime();
                    ticketDB.id_desk = idDesk;
                    ticketDB.id_socket_desk = idSocketDesk;
                    ticketDB.id_assistant = idAssistant;
                    ticketDB.cd_desk = cdDesk;
                    ticketDB.save().then(ticketSaved => {
                        server.io.to(ticketSaved.id_socket).emit('mensaje-privado', { msg: `Usted fue llamado desde el escritorio ${idDesk} por ${assistantDB.tx_name} ` });
                        //server.io.to(ticketSaved.id_company).emit('actualizar-pantalla'); // para clientes
                        server.io.emit('actualizar-pantalla'); // para clientes
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
                    });
                }
            }).catch(() => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar el ticket',
                    ticket: null
                });
            });
        }
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar el asistente',
            assistant: null
        });
    });
}
;
function cancelTicket(req, res) {
    const idTicket = req.params.idTicket;
    ticket_model_1.Ticket.findByIdAndUpdate({ _id: idTicket }, { tm_end: +new Date().getTime() }).then((ticketFinished) => {
        return res.status(200).json({
            ok: true,
            msg: "Ticket finalizado correctamente",
            ticket: ticketFinished
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: "No se pudo finalizar el ticket",
            ticket: null
        });
    });
}
function rejectTicket(req, res) {
    // const { idCompany, idDesk } = req.body;
    // todo: poner a null tm_att
    // const server = Server.instance;
    // const numTickets = this.readPendingTickets(idCompany);
    // server.io.emit('nuevo-turno', numTickets); // para asistentes
    // server.io.emit('actualizar-pantalla'); // para clientes
}
;
function endTicket(req, res) {
    // const { idDesk } = req.body;
    // const ticketToEnd = getPendingTicket(idDesk);
    // const socketCli = ticketToEnd.ticket?.id_socket;
    // res.json(ticket.finalizarTicket(idDesk));
    // const server = Server.instance;
    // // se actualiza la pantalla SOLO del cliente con el turno finalizado
    // if (socketCli) { server.io.to(socketCli).emit('actualizar-pantalla'); }
}
;
function getTickets(req, res) {
    const idCompany = req.params.id_company;
    ticket_model_1.Ticket.find({ id_company: idCompany }).then((tickets) => {
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
    });
}
;
function updateSocket(req, res) {
    const idTicket = req.body.idTicket;
    const oldSocket = req.body.oldSocket;
    const newSocket = req.body.newSocket;
    ticket_model_1.Ticket.findById(idTicket).then((ticketDB) => {
        if (!ticketDB) {
            return res.status(400).json({
                ok: false,
                msg: "No existe el ticket con el socket a actualizar."
            });
        }
        let requestUpdateTo;
        switch (oldSocket) {
            case ticketDB.id_socket: // actualizo el socket del cliente
                ticketDB.id_socket = newSocket;
                requestUpdateTo = ticketDB.id_socket_desk;
                break;
            case ticketDB.id_socket_desk: // actualizo el socket del asistente
                ticketDB.id_socket_desk = newSocket;
                requestUpdateTo = ticketDB.id_socket;
                break;
            default:
                console.log('No se encontro ticket para actualizar');
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
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: "Error al obtener el socket del ticket."
        });
    });
}
module.exports = {
    createTicket,
    cancelTicket,
    takeTicket,
    rejectTicket,
    endTicket,
    readPendingTicket,
    readPendingTickets,
    getTickets,
    updateSocket,
};
