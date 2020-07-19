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
        tx_email: body.tx_email,
        tx_name: body.tx_name,
        id_company: body.id_company,
        id_transaction: body.id_transaction,
        tx_password: bcrypt_1.default.hashSync(body.tx_password, 10),
        tx_img: body.tx_img,
        id_role: 'ASSISTANT_ROLE',
        fc_createdat: new Date()
    });
    assistant.save().then((assistantSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Asistente guardado correctamente',
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
            msg: 'Asistentes obtenidos correctamente',
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
function deleteAssistant(req, res) {
    let idAssistant = req.params.idAssistant;
    user_model_1.User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Asistente eliminado correctamente',
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
    deleteAssistant,
};
