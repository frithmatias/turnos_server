"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const usuario_model_1 = require("../models/usuario.model");
const token_1 = __importDefault(require("../classes/token"));
const environment_prod_1 = require("../environments/environment.prod");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Google Login
var GOOGLE_CLIENT_ID = environment_prod_1.environment.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
// ==================================================
// Update Token
// ==================================================
function updateToken(req, res) {
    var token = token_1.default.getJwtToken({ usuario: req.usuario });
    res.status(200).json({
        ok: true,
        usuario: req.usuario,
        newtoken: token
    });
}
// ==================================================
// Autenticación Google
// ==================================================
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield oauthClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        return {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true,
            payload: payload
        };
    });
}
// ==================================================
// Login Google
// ==================================================
function loginGoogle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var token = req.body.token;
        var googleUser = yield verify(token) // devuelve una promesa
            .catch(err => {
            res.status(403).json({
                ok: false,
                mensaje: "Token no valido",
                error: err
            });
        });
        if (!googleUser) {
            return res.status(500).json({
                ok: false,
                message: "No se pudo obtener el usuario de Google."
            });
        }
        usuario_model_1.Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar usuario",
                    error: err
                });
            }
            if (usuarioDB) {
                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Para el email ingresado debe usar autenticación con clave.",
                        error: err
                    });
                }
                else {
                    // Google SignIn -> new token
                    var token = token_1.default.getJwtToken({ usuario: usuarioDB });
                    usuarioDB.lastlogin = new Date();
                    usuarioDB.save((err, userLastLogin) => {
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                mensaje: "Error al actualizar la fecha de ultimo login del usuario",
                                error: err
                            });
                        }
                        usuarioDB.password = ":)";
                        res.status(200).json({
                            ok: true,
                            mensaje: "Login exitoso.",
                            token: token,
                            id: usuarioDB.id,
                            usuario: usuarioDB,
                            menu: obtenerMenu(usuarioDB.role)
                        });
                    });
                }
            }
            else {
                // el usuario no existe, hay que crearlo.
                var usuario = new usuario_model_1.Usuario();
                usuario.email = googleUser.email;
                usuario.nombre = googleUser.nombre;
                usuario.password = ":)";
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.lastlogin = new Date();
                usuario.createdat = new Date();
                usuario.save((err, usuarioDB) => {
                    if (err) {
                    }
                    var token = token_1.default.getJwtToken({ usuario: usuarioDB });
                    res.status(200).json({
                        ok: true,
                        token: token,
                        mensaje: { message: "OK LOGUEADO " },
                        usuario,
                        menu: obtenerMenu(usuarioDB.role)
                    });
                });
            }
        });
    });
}
// ==================================================
// Login Normal
// ==================================================
function login(req, res) {
    var body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar un usuario",
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas",
                errors: err
            });
        }
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas",
                errors: err
            });
        }
        // Si llego hasta acá, el usuario y la contraseña son correctas, creo el token
        var token = token_1.default.getJwtToken({ usuario: usuarioDB });
        usuarioDB.lastlogin = new Date();
        usuarioDB.save((err, usuarioUpdateLoginDate) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al actualizar la fecha de login",
                    errors: err
                });
            }
            usuarioDB.password = ":)";
            res.status(200).json({
                ok: true,
                mensaje: "Login post recibido.",
                token: token,
                body: body,
                id: usuarioDB._id,
                usuario: usuarioDB,
                menu: obtenerMenu(usuarioDB.role)
            });
        });
    });
}
// ==================================================
// Obtener Menú
// ==================================================
function obtenerMenu(ROLE) {
    var menu = [
        {
            titulo: "Usuario",
            icono: "mdi mdi-account-circle",
            submenu: [
                { titulo: "Mi Perfil", url: "/profile", icono: "mdi mdi-face" },
                { titulo: "Tema", url: "/account-settings", icono: "mdi mdi-format-color-fill" },
                { titulo: "Nuevo Aviso", url: "/aviso-crear/nuevo", icono: "mdi mdi-plus-circle-outline" },
                { titulo: "Mis Favoritos", url: "/favoritos", icono: "mdi mdi-heart" },
                { titulo: "Mis Avisos", url: "/misavisos", icono: "mdi mdi-city" },
                { titulo: "Mis Busquedas", url: "/busquedas", icono: "mdi mdi-search-web" },
            ]
        }
    ];
    if (ROLE === "ADMIN_ROLE") {
        menu.push({
            titulo: "Administracion",
            icono: "mdi mdi-settings",
            submenu: [
                { titulo: "Usuarios", url: "/usuarios", icono: "mdi mdi-account-multiple-plus" },
                { titulo: "Inmobiliarias", url: "/inmobiliarias", icono: "mdi mdi-city" },
                { titulo: "Formularios", url: "/forms", icono: "mdi mdi-table-large" },
                { titulo: "Controles", url: "/controles", icono: "mdi mdi-console" }
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    return menu;
}
module.exports = {
    updateToken,
    loginGoogle,
    login
};
