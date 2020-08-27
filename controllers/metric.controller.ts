import { Request, Response } from 'express';
import { Ticket } from '../models/ticket.model';


// ========================================================
// Metric Methods
// ========================================================

function getTickets(req: Request, res: Response) {

    let { idUser } = req.params;
    
    Ticket.find({id_assistant: idUser},'id_desk id_skill id_position tm_start tm_att tm_end')
    .populate('id_desk')
    .populate('id_skill')
    
    .then(ticketsDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Tickets del asistente obtenidos correctamente',
            tickets: ticketsDB
        })
    }).catch(()=> {
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener los tickets del asistente',
            tickets: null
        })       
    })
}

function getDesktopSessions(req: Request, res: Response) {

    let { idUser } = req.params;
    
    Ticket.find({id_assistant: idUser},'id_desk id_skill id_position tm_start tm_att tm_end')
    .populate('id_desk')
    .populate('id_skill')
    
    .then(ticketsDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Tickets del asistente obtenidos correctamente',
            tickets: ticketsDB
        })
    }).catch(()=> {
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener los tickets del asistente',
            tickets: null
        })       
    })
}


export = {
    getTickets,
    getDesktopSessions
}
