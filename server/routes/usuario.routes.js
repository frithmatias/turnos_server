"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const token_1 = __importDefault(require("../classes/token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middlewares/auth");
const userRoutes = express_1.Router();
userRoutes.get('/prueba', (req, res) => {
    // req es lo que nos estan solicitando y res es la respuesta que vamos a responder desde el backend.
    res.json({
        ok: true,
        mensaje: 'Todo funciono bien.'
    });
});
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        empresa: req.body.empresa,
        role: req.body.role,
        img: req.body.img,
        google: req.body.google
    };
    usuario_model_1.Usuario.create(user)
        .then((userDB) => {
        const token = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            empresa: userDB.empresa,
            role: userDB.role,
            img: userDB.img
        });
        res.json({
            ok: true,
            token
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            err
        });
    });
});
userRoutes.post('/login', auth_1.verificaToken, (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/constraseña no son correctos'
            });
        }
        // si el usuario existe tengo que comparar la contraseña
        if (userDB.checkPassword(body.password)) {
            const token = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                empresa: userDB.empresa,
                role: userDB.role,
                img: userDB.img
            });
            res.json({
                ok: true,
                token
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrecta ***'
            });
        }
    });
});
userRoutes.put('/update', auth_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        empresa: req.body.empresa,
        role: req.body.role,
        img: req.body.img
    };
    if (!user.nombre || !user.email || !user.img || !user.empresa || !user.role) {
        return res.json({
            ok: false,
            message: 'Faltan datos, no se pudo actualizar.'
        });
    }
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        // new: true, le dice a mongoose que devuelva la nueva información del usuario
        // (err, userDB) es una función de callback
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe el usuario'
            });
        }
        // si llego hasta aca el usuario existe y hay que generar un NUEVO token.
        const token = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            empresa: userDB.empresa,
            role: userDB.role,
            img: userDB.img
        });
        res.json({
            ok: true,
            token
        });
    });
});
// Para poder usarlo desde index.ts tengo que exportar userRoutes
exports.default = userRoutes;
