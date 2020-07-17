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
const user_model_1 = require("../models/user.model");
const token_1 = __importDefault(require("../classes/token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const environment_1 = __importDefault(require("../global/environment"));
// Google Login
var GOOGLE_CLIENT_ID = environment_1.default.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
function registerUser(req, res) {
    var body = req.body;
    console.log('REGISTRO DE USUARIO', req.body);
    var usuario = new user_model_1.User({
        email: body.email,
        nombre: body.nombre,
        empresa: body.empresa,
        password: bcrypt_1.default.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        createdat: new Date()
    });
    //===================================
    // SAVE USER
    //===================================
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al guardar el usuario.",
                errors: err
            });
        }
        //===================================
        // SEND MAIL VALIDATOR
        //===================================
        // sendActivationMail(usuarioGuardado.email, usuarioGuardado.nombre, usuarioGuardado._id);
        res.status(201).json({
            ok: true,
            mensaje: "Usuario guardado correctamente.",
            usuario: usuarioGuardado,
            usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
        });
    });
}
function readUser(req, res) {
    user_model_1.User.findById(req.params.id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar el usuario",
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con el id solicitado",
                errors: { message: "No existe usuario con el id solicitado" }
            });
        }
        res.status(200).json({
            ok: true,
            usuario
        });
    });
}
function updateUser(req, res) {
    var body = req.body;
    var id = req.params.id;
    // Verifico que el id existe
    user_model_1.User.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar un usuario",
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con el id " + id,
                errors: { message: "No existe usuario con el id solicitado" }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar el usuario",
                    errors: err
                });
            }
            usuarioGuardado.password = ":)";
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
}
function deleteUser(req, res) {
    var id = req.params.id;
    user_model_1.User.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error borrando usuario",
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error borrando usuario, el usuario solicitado NO existe.",
                errors: { message: "No existe el usuario que intenta borrar." } // Este objeto con los errores viene de mongoose
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: "Usuario borrado correctamente.",
            usuario: usuarioBorrado
        });
    });
}
function updateToken(req, res) {
    var token = token_1.default.getJwtToken({ usuario: req.usuario });
    res.status(200).json({
        ok: true,
        usuario: req.usuario,
        newtoken: token
    });
}
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
        user_model_1.User.findOne({ email: googleUser.email }, (err, usuarioDB) => {
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
                var usuario = new user_model_1.User();
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
function loginUser(req, res) {
    console.log('PORT_', environment_1.default.SERVER_PORT);
    var body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, usuarioDB) => {
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
function obtenerMenu(role) {
    var menu = [];
    if ((role === "ASSISTANT_ROLE") || (role === "CLIENT_ROLE")) {
        menu.push({
            titulo: "Asistente",
            icono: "mdi mdi-settings",
            submenu: [
                { titulo: "Home", url: "/asistente/home", icono: "mdi mdi-search-web" },
                { titulo: "Dashboard", url: "/asistente/dashboard", icono: "mdi mdi-face" },
                { titulo: "Escritorio", url: "/asistente/escritorio", icono: "mdi mdi-format-color-fill" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (role === "USER_ROLE") {
        menu.push({
            titulo: "Usuario",
            icono: "mdi mdi-settings",
            submenu: [
                { titulo: "Home", url: "/user/home", icono: "mdi mdi-search-web" },
                { titulo: "Mi Perfil", url: "/user/profile", icono: "mdi mdi-face" },
                { titulo: "Asistentes", url: "/user/assistants", icono: "mdi mdi-format-color-fill" },
                { titulo: "Ventanillas", url: "/user/desktops", icono: "mdi mdi-plus-circle-outline" },
                { titulo: "Turnos", url: "/user/tickets", icono: "mdi mdi-heart" },
                { titulo: "Dashboard", url: "/user/dashboard", icono: "mdi mdi-city" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (role === "ADMIN_ROLE") {
        menu.push({
            titulo: "Administrador",
            icono: "mdi mdi-settings",
            submenu: [
                { titulo: "Usuarios", url: "/admin/users", icono: "mdi mdi-account-multiple-plus" },
                { titulo: "Empresas", url: "/admin/company", icono: "mdi mdi-city" },
                { titulo: "Turnos", url: "/admin/tickets", icono: "mdi mdi-table-large" },
                { titulo: "Metricas", url: "/admin/metrics", icono: "mdi mdi-console" }
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    return menu;
}
module.exports = {
    registerUser,
    readUser,
    updateUser,
    deleteUser,
    updateToken,
    loginGoogle,
    loginUser,
    obtenerMenu
};
