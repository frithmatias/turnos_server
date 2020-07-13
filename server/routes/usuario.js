"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_1 = require("../models/usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    usuario_1.Usuario.create(user)
        .then((userDB) => {
        res.json({
            ok: true,
            user: userDB
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            err
        });
    });
});
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
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
            // ACA LA GENERACION DEL TOKEN MAS ADELANTE
            res.json({
                ok: true,
                token: 'asdfasdfasdfasdf'
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
// Para poder usarlo desde index.ts tengo que exportar userRoutes
exports.default = userRoutes;
