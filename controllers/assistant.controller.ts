import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { Company } from '../models/company.model';

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

function readAssistantsUser(req: Request, res: Response) {
    let idUser = req.params.idUser;
    Company.find({ id_user: idUser }).then(companiesDB => {
        return companiesDB.map(data => data._id) // solo quiero los _id
    }).then(resp => {
        User
            .find({ $or: [{ '_id': idUser }, { id_company: { $in: resp } }] })
            .populate('id_company').then(assistantsDB => {
                if (!assistantsDB) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No existen asistentes para la empresa seleccionada',
                        assistants: null
                    })
                }
                return res.status(200).json({
                    ok: true,
                    msg: 'Asistentes obtenidos correctamente',
                    assistants: assistantsDB
                })
            }).catch(() => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar los asistentes para las empresas del user',
                    assistants: null
                })
            }).catch(() => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar las empresas del user',
                    assistants: null
                })
            })
    })

}

function readAssistants(req: Request, res: Response) {
    let idCompany = req.params.idCompany;

    User.find({ id_company: idCompany })
        .populate('id_company').then(assistantsDB => {
            if (!assistantsDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen asistentes para la empresa seleccionada',
                    assistants: null
                })
            }
            return res.status(200).json({
                ok: true,
                msg: 'Asistentes obtenidos correctamente',
                assistants: assistantsDB
            })
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los asistentes para las empresas del user',
                assistants: null
            })
        })


}


function updateAssistant(req: Request, res: Response) {

    var body = req.body;

    let assistant: any = {
        id_role: body.id_role,
        id_company: body.id_company,
        tx_name: body.tx_name,
        tx_email: body.tx_email,
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
    readAssistantsUser,
    readAssistants,
    updateAssistant,
    deleteAssistant,
}
