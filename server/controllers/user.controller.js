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
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const environment_1 = __importDefault(require("../global/environment"));
const user_model_1 = require("../models/user.model");
const company_model_1 = require("../models/company.model");
// Google Login
var GOOGLE_CLIENT_ID = environment_1.default.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
// ========================================================
// User Methods
// ========================================================
function registerUser(req, res) {
    var body = req.body;
    console.log(body);
    // Save Company
    var company = new company_model_1.Company({
        tx_company_name: body.company.tx_company_name,
        tx_public_name: body.company.tx_public_name,
        tx_address_street: body.company.tx_address_street,
        tx_address_number: body.company.tx_address_number,
        cd_city: body.company.cd_city,
        fc_att_start: null,
        fc_att_end: null
    });
    company.save().then((companySaved) => {
        // Save User
        var user = new user_model_1.User({
            tx_name: body.user.tx_name,
            tx_email: body.user.tx_email,
            id_company: companySaved._id,
            tx_password: bcrypt_1.default.hashSync(body.user.tx_password, 10),
            bl_google: false,
            fc_createdat: new Date()
        });
        user.save().then((userSaved) => {
            res.status(201).json({
                ok: true,
                msg: "Usuario guardado correctamente.",
                user: userSaved,
                company: companySaved
            });
        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                msg: "Error al guardar el usuario.",
                errors: err
            });
        });
    }).catch((err) => {
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: "Error al guardar la empresa.",
            errors: err
        });
    });
}
function readUser(req, res) {
    user_model_1.User.findById(req.params.id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error al buscar el usuario",
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe un usuario con el id solicitado",
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
                msg: "Error al buscar un usuario",
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe un usuario con el id " + id,
                errors: { message: "No existe usuario con el id solicitado" }
            });
        }
        usuario.tx_name = body.tx_name;
        usuario.tx_email = body.tx_email;
        usuario.id_role = body.id_role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: "Error al actualizar el usuario",
                    errors: err
                });
            }
            usuarioGuardado.tx_password = ":)";
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
                msg: "Error borrando usuario",
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                msg: "Error borrando usuario, el usuario solicitado NO existe.",
                errors: { message: "No existe el usuario que intenta borrar." } // Este objeto con los errores viene de mongoose
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Usuario borrado correctamente.",
            usuario: usuarioBorrado
        });
    });
}
// ========================================================
// Session methods
// ========================================================
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
            name: payload.name,
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
                msg: "Token no valido",
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
                    msg: "Error al buscar usuario",
                    error: err
                });
            }
            if (usuarioDB) {
                if (usuarioDB.bl_google === false) {
                    return res.status(400).json({
                        ok: false,
                        msg: "Para el email ingresado debe usar autenticación con clave.",
                        error: err
                    });
                }
                else {
                    // Google SignIn -> new token
                    var token = token_1.default.getJwtToken({ usuario: usuarioDB });
                    usuarioDB.fc_lastlogin = new Date();
                    usuarioDB.save((err, userLastLogin) => {
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                msg: "Error al actualizar la fecha de ultimo login del usuario",
                                error: err
                            });
                        }
                        usuarioDB.tx_password = ":)";
                        res.status(200).json({
                            ok: true,
                            msg: "Login exitoso.",
                            token: token,
                            id: usuarioDB.id,
                            usuario: usuarioDB,
                            menu: obtenerMenu(usuarioDB.id_role)
                        });
                    });
                }
            }
            else {
                // el usuario no existe, hay que crearlo.
                var usuario = new user_model_1.User();
                usuario.tx_email = googleUser.tx_email;
                usuario.tx_name = googleUser.tx_name;
                usuario.tx_password = ":)";
                usuario.id_company = googleUser.tx_email;
                usuario.tx_img = googleUser.tx_img;
                usuario.bl_google = true;
                usuario.fc_lastlogin = new Date();
                usuario.fc_createdat = new Date();
                usuario.id_role = 'USER_ROLE';
                usuario.save((err, usuarioDB) => {
                    var token = token_1.default.getJwtToken({ usuario: usuarioDB });
                    res.status(200).json({
                        ok: true,
                        token: token,
                        msg: { message: "OK LOGUEADO " },
                        usuario,
                    });
                });
            }
        });
    });
}
function loginUser(req, res) {
    var body = req.body;
    user_model_1.User.findOne({ tx_email: body.tx_email }).then(usuarioDB => {
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas1"
            });
        }
        if (!bcrypt_1.default.compareSync(body.tx_password, usuarioDB.tx_password)) {
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas2"
            });
        }
        // Si llego hasta acá, el usuario y la contraseña son correctas, creo el token
        var token = token_1.default.getJwtToken({ usuario: usuarioDB });
        usuarioDB.fc_lastlogin = new Date();
        usuarioDB.save().then(() => {
            usuarioDB.tx_password = ":)";
            res.status(200).json({
                ok: true,
                msg: "Login post recibido.",
                token: token,
                body: body,
                id: usuarioDB._id,
                usuario: usuarioDB,
                menu: obtenerMenu(usuarioDB.id_role)
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                msg: "Error al actualizar la fecha de login",
                errors: err
            });
        });
    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            msg: "Error al buscar un usuario",
            errors: err
        });
    });
}
function obtenerMenu(id_role) {
    var menu = [];
    console.log(id_role);
    if ((id_role === "ASSISTANT_ROLE") || (id_role === "USER_ROLE")) {
        menu.push({
            titulo: "Asistente",
            icon: "mdi mdi-settings",
            submenu: [
                { titulo: "Home", url: "/asistente/home", icon: "home" },
                { titulo: "Dashboard", url: "/asistente/dashboard", icon: "dashboard" },
                { titulo: "Escritorio", url: "/asistente/escritorio", icon: "desktop_windows" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (id_role === "USER_ROLE") {
        menu.push({
            titulo: "Usuario",
            icon: "mdi mdi-settings",
            submenu: [
                { titulo: "Home", url: "/user/home", icon: "home_work" },
                { titulo: "Mi Perfil", url: "/user/profile", icon: "face" },
                { titulo: "Asistentes", url: "/user/assistants", icon: "supervised_user_circle" },
                { titulo: "Ventanillas", url: "/user/desktops", icon: "exit_to_app" },
                { titulo: "Skills", url: "/user/skills", icon: "playlist_add_check" },
                { titulo: "Turnos", url: "/user/tickets", icon: "bookmark" },
                { titulo: "Dashboard", url: "/user/dashboard", icon: "dashboard" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (id_role === "ADMIN_ROLE") {
        menu.push({
            titulo: "Administrador",
            icon: "mdi mdi-settings",
            submenu: [
                { titulo: "Usuarios", url: "/admin/users", icon: "mdi mdi-account-multiple-plus" },
                { titulo: "Empresas", url: "/admin/company", icon: "mdi mdi-city" },
                { titulo: "Turnos", url: "/admin/tickets", icon: "mdi mdi-table-large" },
                { titulo: "Metricas", url: "/admin/metrics", icon: "mdi mdi-console" }
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
