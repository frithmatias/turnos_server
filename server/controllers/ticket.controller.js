"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("../classes/server"));
// MODELS
const ticket_model_1 = require("../models/ticket.model");
const status_model_1 = require("../models/status.model");
const user_model_1 = require("../models/user.model");
const skill_model_1 = require("../models/skill.model");
const desktop_model_1 = require("../models/desktop.model");
const server = server_1.default.instance; // singleton
function createTicket(req, res) {
    const { idSkill, idSocket, blPriority } = req.body;
    const idDay = +new Date().getDate();
    const idMonth = +new Date().getMonth() + 1;
    const idYear = +new Date().getFullYear();
    let cdNumber;
    skill_model_1.Skill.findById(idSkill).then(skillDB => {
        if (!skillDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el skill solicitado',
                ticket: null
            });
        }
        // busco la posición que le corresponde
        status_model_1.Status.findOneAndUpdate({
            id_skill: idSkill,
            id_year: idYear,
            id_month: idMonth,
            id_day: idDay
        }, { $inc: { cd_number: 1 } }, { new: true }).then((skillNextNumber) => {
            // si no existe el primer turno lo crea
            if (!skillNextNumber) {
                let newSkillStatus = new status_model_1.Status({
                    id_skill: idSkill,
                    id_year: idYear,
                    id_month: idMonth,
                    id_day: idDay,
                    cd_number: 1
                });
                newSkillStatus.save()
                    .catch(() => {
                    return res.status(400).json({
                        ok: false,
                        msg: "El nuevo status no se pudo guardar."
                    });
                });
                cdNumber = newSkillStatus.cd_number;
            }
            if (skillNextNumber) {
                cdNumber = skillNextNumber.cd_number;
            }
            let idCompany = skillDB.id_company;
            // guardo el ticket
            let ticket = new ticket_model_1.Ticket({
                id_root: null,
                id_child: null,
                bl_priority: blPriority,
                cd_number: cdNumber,
                id_socket: idSocket,
                id_socket_desk: null,
                id_desk: null,
                id_assistant: null,
                id_company: idCompany,
                id_skill: idSkill,
                tm_start: +new Date().getTime(),
                tm_att: null,
                tm_end: null
            });
            ticket.id_root = ticket._id;
            ticket.save().then((ticketSaved) => {
                const server = server_1.default.instance;
                server.io.to(idSocket).emit('mensaje-privado', { msg: 'Bienvenido, puede realizar culquier consulta por aquí. Gracias por esperar.' });
                server.io.to(idCompany).emit('nuevo-turno');
                let ticketUser = {
                    _id: ticketSaved._id,
                    cd_number: ticketSaved.cd_number,
                    id_socket: ticketSaved.id_socket,
                    id_socket_desk: null,
                    id_desk: null,
                    id_assistant: null,
                    id_company: ticketSaved.id_company,
                    id_skill: skillDB,
                    tm_start: ticketSaved.tm_start,
                    tm_att: null,
                    tm_end: null
                };
                res.status(201).json({
                    ok: true,
                    msg: "Ticket guardado correctamente.",
                    ticket: ticketUser
                });
            }).catch(() => {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al guardar el ticket',
                    ticket: false
                });
            });
        }).catch(() => {
            return res.status(400).json({
                ok: false,
                msg: "Error al procesar el status de los tickets para la empresa."
            });
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'No se pudo obtener el skill solicitado',
            ticket: null
        });
    });
}
;
function getCountPending(idCompany) {
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
    const { idDesk, idSocketDesk, idAssistant } = req.body;
    desktop_model_1.Desktop.findById(idDesk).then(desktopDB => {
        if (!desktopDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el escritorio!',
                assistant: null
            });
        }
        user_model_1.User.findById(idAssistant).then(assistantDB => {
            if (!assistantDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el asistente!',
                    assistant: null
                });
            }
            if (assistantDB) {
                // Busco un nuevo ticket para atender
                ticket_model_1.Ticket.findOne({
                    id_company: assistantDB.id_company,
                    id_skill: { $in: assistantDB.id_skills },
                    id_desk: null,
                    tm_end: null
                })
                    .sort({ bl_priority: -1, tm_start: 1 }) // priority true first
                    // .limit(1)
                    .then(ticketDB => {
                    if (!ticketDB) {
                        return res.status(200).json({
                            ok: false,
                            msg: 'No existen tickets pendientes.',
                            ticket: null
                        });
                    }
                    if (ticketDB) {
                        ticketDB.tm_att = +new Date().getTime();
                        ticketDB.id_desk = idDesk;
                        ticketDB.id_socket_desk = idSocketDesk;
                        ticketDB.id_assistant = idAssistant;
                        ticketDB.save().then(ticketSaved => {
                            server.io.to(ticketSaved.id_socket).emit('mensaje-privado', { msg: `Usted fue llamado desde el escritorio ${desktopDB.cd_desktop} por ${assistantDB.tx_name} ` });
                            //server.io.to(ticketSaved.id_company).emit('actualizar-pantalla'); // para clientes
                            if (ticketSaved === null || ticketSaved === void 0 ? void 0 : ticketSaved.id_company) {
                                server.io.to(ticketSaved.id_company).emit('actualizar-pantalla');
                            }
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
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar el escritorio',
            assistant: null
        });
    });
}
;
function cancelTicket(req, res) {
    const idTicket = req.params.idTicket;
    ticket_model_1.Ticket.findByIdAndUpdate(idTicket, { tm_end: +new Date().getTime() }).then((ticketCanceled) => {
        if (ticketCanceled) {
            if (ticketCanceled.id_socket_desk) {
                // cancel dekstop session and update tickets on assistant desktop 
                server.io.to(ticketCanceled.id_socket_desk).emit('turno-cancelado', ticketCanceled._id);
            }
            else {
                // update tickets on desktops
                server.io.to(ticketCanceled.id_company).emit('nuevo-turno');
            }
            return res.status(200).json({
                ok: true,
                msg: "Ticket finalizado correctamente",
                ticket: ticketCanceled
            });
        }
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: "No se pudo finalizar el ticket",
            ticket: null
        });
    });
}
function releaseTicket(req, res) {
    const idTicket = req.body.idTicket;
    ticket_model_1.Ticket.findByIdAndUpdate(idTicket, {
        tm_att: null,
        id_desk: null,
        id_socket_desk: null,
        id_assistant: null,
        tm_end: null
    }, { new: true }).then(ticketReleased => {
        if (ticketReleased === null || ticketReleased === void 0 ? void 0 : ticketReleased.id_company) {
            server.io.to(ticketReleased.id_company).emit('actualizar-pantalla');
        }
        return res.status(200).json({
            ok: true,
            msg: 'Ticket soltado correctamente',
            ticket: ticketReleased
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'No se pudo soltar el ticket',
            ticket: null
        });
    });
}
;
function reassignTicket(req, res) {
    // desvía un ticket de un skill a otro dejando en el ticket un id_parent con el id del documento original 
    // un id_child con el nuevo ticket creado en el nuevo skill. 
    const { idTicket, idSkill, blPriority } = req.body;
    const idDay = +new Date().getDate();
    const idMonth = +new Date().getMonth() + 1;
    const idYear = +new Date().getFullYear();
    let cdNumber;
    ticket_model_1.Ticket.findById(idTicket).then(ticketParentDB => {
        if (!ticketParentDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el ticket a reenviar',
                ticket: null
            });
        }
        skill_model_1.Skill.findById(idSkill).then((skillDB) => {
            if (!skillDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el skill solicitado',
                    ticket: null
                });
            }
            // busco la posición que le corresponde
            status_model_1.Status.findOneAndUpdate({
                id_skill: idSkill,
                id_year: idYear,
                id_month: idMonth,
                id_day: idDay
            }, { $inc: { cd_number: 1 } }, { new: true }).then((skillNextNumber) => {
                if (!skillNextNumber) {
                    // si no existe el primer turno lo crea
                    let newSkillStatus = new status_model_1.Status({
                        id_skill: idSkill,
                        id_year: idYear,
                        id_month: idMonth,
                        id_day: idDay,
                        cd_number: 1
                    });
                    newSkillStatus.save()
                        .catch(() => {
                        return res.status(400).json({
                            ok: false,
                            msg: "El nuevo status no se pudo guardar."
                        });
                    });
                    cdNumber = newSkillStatus.cd_number;
                }
                if (skillNextNumber) {
                    cdNumber = skillNextNumber.cd_number;
                }
                let idCompany = skillDB.id_company;
                let idSocket = ticketParentDB.id_socket;
                let idRoot = ticketParentDB.id_root;
                // guardo el ticket
                let ticket = new ticket_model_1.Ticket({
                    id_root: idRoot,
                    id_child: null,
                    bl_priority: blPriority,
                    cd_number: cdNumber,
                    id_socket: idSocket,
                    id_socket_desk: null,
                    id_desk: null,
                    id_assistant: null,
                    id_company: idCompany,
                    id_skill: idSkill,
                    tm_start: +new Date().getTime(),
                    tm_att: null,
                    tm_end: null
                });
                ticket.save().then((ticketChildSaved) => {
                    const server = server_1.default.instance;
                    server.io.to(idSocket).emit('mensaje-privado', { msg: 'Bienvenido, puede realizar culquier consulta por aquí. Gracias por esperar.' });
                    getCountPending(idCompany).then(resp => {
                        if (resp.ok) {
                            server.io.to(idCompany).emit('nuevo-turno', resp.num);
                        }
                    });
                    let ticketUser = {
                        id_root: ticketChildSaved.id_root,
                        cd_number: ticketChildSaved.cd_number,
                        id_socket: ticketChildSaved.id_socket,
                        id_socket_desk: null,
                        id_desk: null,
                        id_assistant: null,
                        id_company: ticketChildSaved.id_company,
                        id_skill: skillDB,
                        tm_start: ticketChildSaved.tm_start,
                        tm_att: null,
                        tm_end: null
                    };
                    ticketParentDB.id_child = ticketChildSaved._id;
                    ticketParentDB.tm_end = +new Date().getTime();
                    ticketParentDB.save().then(ticketParentSaved => {
                        if (ticketChildSaved === null || ticketChildSaved === void 0 ? void 0 : ticketChildSaved.id_company) {
                            server.io.to(ticketChildSaved.id_company).emit('actualizar-pantalla');
                        }
                        res.status(201).json({
                            ok: true,
                            msg: "Ticket guardado correctamente.",
                            ticket: ticketUser
                        });
                    });
                }).catch(() => {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Error al guardar el ticket',
                        ticket: false
                    });
                });
            }).catch(() => {
                return res.status(400).json({
                    ok: false,
                    msg: "Error al procesar el status de los tickets para la empresa."
                });
            });
        }).catch(() => {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo obtener el skill solicitado',
                ticket: null
            });
        });
    });
}
;
function endTicket(req, res) {
    const idTicket = req.body.idTicket;
    ticket_model_1.Ticket.findByIdAndUpdate(idTicket, { tm_end: +new Date().getTime() }).then(ticketEnded => {
        if (ticketEnded === null || ticketEnded === void 0 ? void 0 : ticketEnded.id_company) {
            server.io.to(ticketEnded.id_company).emit('actualizar-pantalla'); // clients
            getCountPending(ticketEnded.id_company).then(resp => {
                if (resp.ok) {
                    server.io.to(ticketEnded.id_company).emit('nuevo-turno', resp.num);
                }
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Ticket finalizado correctamente',
            ticket: ticketEnded
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'No se pudo finalizar el ticket',
            ticket: null
        });
    });
}
;
function getTickets(req, res) {
    const idCompany = req.params.id_company;
    ticket_model_1.Ticket.find({ id_company: idCompany })
        .populate('id_desk')
        .populate('id_skill')
        .then((tickets) => {
        if (tickets.length > 0) {
            return res.status(200).json({
                ok: true,
                msg: "Se encontraron tickets para la empresa solicitada.",
                tickets
            });
        }
        return res.status(200).json({
            ok: false,
            msg: "No existen tickets para la empresa solicitada.",
            tickets: []
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
                if (ticketDB.id_socket_desk) {
                    requestUpdateTo = ticketDB.id_socket_desk;
                }
                break;
            case ticketDB.id_socket_desk: // actualizo el socket del asistente
                ticketDB.id_socket_desk = newSocket;
                requestUpdateTo = ticketDB.id_socket;
                break;
            default:
                break;
        }
        ticketDB.save().then((ticketUpdated) => {
            // antes de enviar el ticket actualizado al solicitante, tengo que 
            // avisarle a la otra parte, que tiene que actualizar el ticket. 
            if (requestUpdateTo) {
                server.io.to(requestUpdateTo).emit('ticket-updated', {
                    ok: true,
                    msg: 'El socket del destino ha cambiado',
                    ticket: ticketUpdated
                });
            }
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
    releaseTicket,
    reassignTicket,
    endTicket,
    getTickets,
    updateSocket,
};
