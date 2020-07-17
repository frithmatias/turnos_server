"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const token_1 = __importDefault(require("../classes/token"));
let verificaToken = (req, res, next) => {
    const userToken = req.get('turnos-token' || '');
    token_1.default.checkToken(userToken)
        .then((decoded) => {
        req.usuario = decoded.usuario;
        next();
    })
        .catch((err) => {
        res.json({
            ok: false,
            err: 'Token incorrecto'
        });
    });
};
let canUpdate = (req, res, next) => {
    var user_request = req.usuario;
    var user_to_update = req.params.id;
    if (user_request.role === "ADMIN_ROLE" ||
        user_request._id === user_to_update) {
        next();
        return;
    }
    else {
        return res.status(401).json({
            //401 UNAUTHORIZED
            ok: false,
            msg: "Token Incorrecto - el role no es ADMIN_ROLE"
        });
    }
};
module.exports = {
    verificaToken,
    canUpdate
};
