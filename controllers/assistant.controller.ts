import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

// ========================================================
// Assistant Methods
// ========================================================

function createAssistant(req: Request, res: Response) {

    var body = req.body;

    var assistant = new User({
        tx_email: body.tx_email,
        tx_name: body.tx_name,
        id_company: body.id_company,
        id_transaction: body.id_transaction,
        tx_password: bcrypt.hashSync(body.tx_password, 10),
        tx_img: body.tx_img,
        id_role: 'ASSISTANT_ROLE',
        fc_createdat: new Date()
    });

    assistant.save().then((assistantSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Asistente guardado correctamente',
            assistant: assistantSaved
        })
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: 'El mail ya esta registrado',
            assistant: null
        });
    });
}

function readAssistants(req: Request, res: Response) {
    let idCompany = req.params.idCompany;
    User.find({ id_company: idCompany }).then((assistants) => {
        res.status(200).json({
            ok: true,
            msg: 'Asistentes obtenidos correctamente',
            assistants
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los asistentes',
            assistants: null
        })
    })
}

function deleteAssistant(req: Request, res: Response) {
    let idAssistant = req.params.idAssistant;
    User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Asistente eliminado correctamente',
            assistant: assistantDeleted
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar al asistente',
            assistant: null
        })
    })
}

export = {
    createAssistant,
    readAssistants,
    deleteAssistant,
}
