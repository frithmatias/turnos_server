"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// ========================================================
// Assistant Methods
// ========================================================
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
            assistant: assistantSaved
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: 'El mail ya esta registrado',
            assistant: null
        });
    });
}
function readAssistants(req, res) {
    let idCompany = req.params.idCompany;
    user_model_1.User.find({ id_company: idCompany }).then((assistants) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuarios obtenidos correctamente',
            assistants
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los asistentes',
            assistants: null
        });
    });
}
function updateAssistant(req, res) {
    var body = req.body;
    let assistant = {
        id_role: body.id_role,
        tx_email: body.tx_email,
        tx_name: body.tx_name,
        id_skills: body.id_skills
    };
    if (body.tx_password !== '******') {
        assistant.tx_password = bcrypt_1.default.hashSync(body.tx_password, 10);
    }
    user_model_1.User.findByIdAndUpdate(body._id, assistant).then(assistantDB => {
        return res.status(200).json({
            ok: true,
            msg: 'Se actualizo el asistente correctamente',
            assistant: assistantDB
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Ocurrio un error al actualizar el asistente',
            assistant: null
        });
    });
}
function deleteAssistant(req, res) {
    let idAssistant = req.params.idAssistant;
    user_model_1.User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado correctamente',
            assistant: assistantDeleted
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar al asistente',
            assistant: null
        });
    });
}
module.exports = {
    createAssistant,
    readAssistants,
    updateAssistant,
    deleteAssistant,
};
