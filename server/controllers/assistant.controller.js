"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const company_model_1 = require("../models/company.model");
const session_model_1 = require("../models/session.model");
// ========================================================
// Assistant && Session Methods
// ========================================================
// crud
function createAssistant(req, res) {
    var body = req.body;
    var assistant = new user_model_1.User({
        tx_name: body.tx_name,
        tx_email: body.tx_email,
        tx_password: bcrypt_1.default.hashSync(body.tx_password, 10),
        id_company: body.id_company,
        id_role: 'ASSISTANT_ROLE',
        id_skills: body.id_skills,
        tx_img: body.tx_img,
        fc_createdat: new Date()
    });
    assistant.save().then((assistantSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario guardado correctamente',
            user: assistantSaved
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: 'El mail ya esta registrado',
            user: null
        });
    });
}
function readAssistants(req, res) {
    let idCompany = req.params.idCompany;
    user_model_1.User.find({ id_company: idCompany })
        .populate('id_company').then(usersDB => {
        if (!usersDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen asistentes para la empresa seleccionada',
                users: null
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Asistentes obtenidos correctamente',
            users: usersDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar los asistentes para las empresas del user',
            users: null
        });
    });
}
function updateAssistant(req, res) {
    var body = req.body;
    let user = {
        id_role: body.id_role,
        id_company: body.id_company,
        tx_name: body.tx_name,
        tx_email: body.tx_email,
        id_skills: body.id_skills
    };
    if (body.tx_password !== '******') {
        user.tx_password = bcrypt_1.default.hashSync(body.tx_password, 10);
    }
    user_model_1.User.findByIdAndUpdate(body._id, user, { new: true })
        .populate('id_skills')
        .populate('id_company')
        .then(userDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el asistente correctamente',
            user: userDB
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error al actualizar el asistente',
            user: null
        });
    });
}
function deleteAssistant(req, res) {
    let idAssistant = req.params.idAssistant;
    user_model_1.User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
            user: assistantDeleted
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar al asistente',
            user: null
        });
    });
}
// auxiliar
function readAssistantsUser(req, res) {
    // obtiene todos los asistentes de todas las empresas de un usuario
    let idUser = req.params.idUser;
    company_model_1.Company.find({ id_user: idUser }).then(companiesDB => {
        return companiesDB.map(data => data._id); // solo quiero los _id
    }).then(resp => {
        user_model_1.User
            .find({ $or: [{ '_id': idUser }, { id_company: { $in: resp } }] })
            .populate('id_company').then(usersDB => {
            if (!usersDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen asistentes para la empresa seleccionada',
                    users: null
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Asistentes obtenidos correctamente',
                users: usersDB
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los asistentes para las empresas del user',
                users: null
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar las empresas del user',
                users: null
            });
        });
    });
}
function readActiveSessionsBySkill(req, res) {
    let idSkill = req.params.idSkill;
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
    user_model_1.User.find({ id_skills: { $elemMatch: idSkill } }).then(companiesDB => {
        return companiesDB.map(data => data._id); // solo quiero un array con los _id
    }).then(idUsers => {
        session_model_1.Session.find({ fc_start: { $gt: today }, fc_end: null, id_assistant: { $in: idUsers } }).then(sessionsDB => {
            return res.status(200).json({
                ok: true,
                msg: 'Sesiones obtenidas correctamente',
                sessions: sessionsDB
            });
        }).catch(() => {
            return res.status(400).json({
                ok: false,
                msg: 'Error al consultar las sesiones activas para los usuarios con el skill indicado',
                sessions: null
            });
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Error al consultar los usuarios con el skill indicado',
            sessions: null
        });
    });
}
module.exports = {
    createAssistant,
    readAssistants,
    readAssistantsUser,
    readActiveSessionsBySkill,
    updateAssistant,
    deleteAssistant,
};
