import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

// ========================================================
// Assistant Methods
// ========================================================

function createAssistant(req: Request, res: Response) {

    var body = req.body;

    var assistant = new User({
        tx_name: body.tx_name,
        tx_email: body.tx_email,
        tx_password: bcrypt.hashSync(body.tx_password, 10),
        id_company: body.id_company,
        id_role: 'ASSISTANT_ROLE',
        id_skills: body.id_skills,
        tx_img: body.tx_img,
        fc_createdat: new Date()
    });

    assistant.save().then((assistantSaved: any) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario guardado correctamente',
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
            msg: 'Usuarios obtenidos correctamente',
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

function updateAssistant(req: Request, res: Response) {

    var body = req.body;

    let assistant: any = {
        id_role: body.id_role,
        tx_email: body.tx_email,
        tx_name: body.tx_name,
        id_skills: body.id_skills
    }

    if (body.tx_password !== '******') { assistant.tx_password = bcrypt.hashSync(body.tx_password, 10); }

    User.findByIdAndUpdate(body._id, assistant).then(assistantDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el asistente correctamente',
            assistant: assistantDB
        })
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error al actualizar el asistente',
            assistant: null
        })
    })
}

function deleteAssistant(req: Request, res: Response) {
    let idAssistant = req.params.idAssistant;
    User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
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
    updateAssistant,
    deleteAssistant,
}
