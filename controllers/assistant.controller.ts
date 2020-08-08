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
            user: assistantSaved
        })
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: 'El mail ya esta registrado',
            user: null
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
            .populate('id_company').then(usersDB => {
                if (!usersDB) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No existen asistentes para la empresa seleccionada',
                        users: null
                    })
                }
                return res.status(200).json({
                    ok: true,
                    msg: 'Asistentes obtenidos correctamente',
                    users: usersDB
                })
            }).catch(() => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar los asistentes para las empresas del user',
                    users: null
                })
            }).catch(() => {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar las empresas del user',
                    users: null
                })
            })
    })

}

function readAssistants(req: Request, res: Response) {
    let idCompany = req.params.idCompany;

    User.find({ id_company: idCompany })
        .populate('id_company').then(usersDB => {
            if (!usersDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen asistentes para la empresa seleccionada',
                    users: null
                })
            }
            return res.status(200).json({
                ok: true,
                msg: 'Asistentes obtenidos correctamente',
                users: usersDB
            })
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los asistentes para las empresas del user',
                users: null
            })
        })


}


function updateAssistant(req: Request, res: Response) {

    var body = req.body;

    let user: any = {
        id_role: body.id_role,
        id_company: body.id_company,
        tx_name: body.tx_name,
        tx_email: body.tx_email,
        id_skills: body.id_skills
    }

    if (body.tx_password !== '******') { user.tx_password = bcrypt.hashSync(body.tx_password, 10); }

    User.findByIdAndUpdate(body._id, user, {new: true})
    .populate('id_skills')
    .populate('id_company')
    .then(userDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el asistente correctamente',
            user: userDB
        })
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error al actualizar el asistente',
            user: null
        })
    })
}

function deleteAssistant(req: Request, res: Response) {
    let idAssistant = req.params.idAssistant;
    User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
            user: assistantDeleted
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar al asistente',
            user: null
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
