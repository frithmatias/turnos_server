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
// Google Login
var GOOGLE_CLIENT_ID = environment_1.default.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);
// ========================================================
// User Methods
// ========================================================
function createUser(req, res) {
    var body = req.body;
    var user = new user_model_1.User({
        tx_name: body.user.tx_name,
        tx_email: body.user.tx_email,
        tx_password: bcrypt_1.default.hashSync(body.user.tx_password, 10),
        bl_google: false,
        fc_createdat: new Date()
    });
    user.save().then((userSaved) => {
        res.status(201).json({
            ok: true,
            msg: "Usuario guardado correctamente.",
            user: userSaved
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            msg: "Error al guardar el user.",
            errors: err
        });
    });
}
function attachCompany(req, res) {
    let company = req.body.company;
    let idUser = req.params.idUser;
    user_model_1.User.findByIdAndUpdate(idUser, { 'id_company': company._id }, { new: true })
        .populate('id_company')
        .populate('id_skills')
        .then(userUpdated => {
        return res.status(200).json({
            ok: true,
            msg: 'La empresa se asigno al user correctamente',
            user: userUpdated
        });
    }).catch(() => {
        return res.status(500).json({
            ok: true,
            msg: 'No se pudo asignar la empresa al user',
            user: null
        });
    });
}
function checkEmailExists(req, res) {
    let pattern = req.body.pattern;
    user_model_1.User.findOne({ tx_email: pattern }).then(userDB => {
        if (!userDB) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe el email'
            });
        }
        return res.status(200).json({
            ok: false,
            msg: 'El email ya existe.'
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar si existe el email'
        });
    });
}
function updateToken(req, res) {
    var token = token_1.default.getJwtToken({ user: req.user });
    res.status(200).json({
        ok: true,
        user: req.user,
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
        var gtoken = req.body.gtoken;
        var googleUser = yield verify(gtoken) // devuelve una promesa
            .catch(err => {
            res.status(403).json({
                ok: false,
                msg: "Token de Google no valido",
                err
            });
        });
        if (!googleUser) {
            return res.status(500).json({
                ok: false,
                message: "No se pudo obtener el user de Google.",
                err: null
            });
        }
        user_model_1.User.findOne({ tx_email: googleUser.email })
            .populate('id_company')
            .populate('id_skills')
            .then(userDB => {
            if (userDB) { // el user existe, intenta loguearse
                if (userDB.bl_google === false) {
                    return res.status(400).json({
                        ok: false,
                        msg: "Para el email ingresado debe usar autenticación con clave.",
                        user: null
                    });
                }
                else {
                    // Google SignIn -> new token
                    var token = token_1.default.getJwtToken({ user: userDB });
                    userDB.updateOne({ fc_lastlogin: +new Date().getTime() })
                        .then(userSaved => {
                        userSaved.tx_password = ":)";
                        res.status(200).json({
                            ok: true,
                            msg: 'Login exitoso',
                            token: token,
                            user: userDB,
                            menu: obtenerMenu(userDB.id_role),
                            home: '/user/home'
                        });
                    }).catch((err) => {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Error al loguear el user de Google',
                            err
                        });
                    });
                }
            }
            else { // el user no existe, hay que crearlo.
                var user = new user_model_1.User();
                user.tx_email = googleUser.email;
                user.tx_name = googleUser.name;
                user.tx_password = ':)';
                user.tx_img = googleUser.img;
                user.bl_google = true;
                user.fc_lastlogin = new Date();
                user.fc_createdat = new Date();
                user.id_role = 'USER_ROLE';
                user.save().then(userSaved => {
                    var token = token_1.default.getJwtToken({ user: userDB });
                    res.status(200).json({
                        ok: true,
                        msg: 'Usuario creado y logueado correctamente',
                        token: token,
                        user,
                        menu: obtenerMenu(userSaved.id_role),
                        home: '/user/home'
                    });
                }).catch((err) => {
                    res.status(500).json({
                        ok: false,
                        msg: 'Error al guardar el user de Google',
                        err
                    });
                });
            }
        }).catch((err) => {
            res.status(500).json({
                ok: false,
                msg: "Error al buscar user",
                error: err
            });
        });
    });
}
function loginUser(req, res) {
    var body = req.body;
    user_model_1.User.findOne({ tx_email: body.tx_email })
        .populate('id_company')
        .populate({ path: 'id_skills', select: 'cd_skill tx_skill' })
        .then(userDB => {
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: "Usuaro o Contraseña incorrecta."
            });
        }
        if (!bcrypt_1.default.compareSync(body.tx_password, userDB.tx_password)) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña o usuario incorrecto."
            });
        }
        // Si llego hasta acá, el user y la contraseña son correctas, creo el token
        var token = token_1.default.getJwtToken({ user: userDB });
        userDB.fc_lastlogin = new Date();
        userDB.save().then(() => {
            userDB.tx_password = ":)";
            let home = userDB.id_role === 'USER_ROLE' ? '/user/home' : '/assistant/home';
            res.status(200).json({
                ok: true,
                msg: "Login post recibido.",
                token: token,
                body: body,
                id: userDB._id,
                user: userDB,
                menu: obtenerMenu(userDB.id_role),
                home
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
            msg: "Error al buscar un user",
            errors: err
        });
    });
}
function obtenerMenu(id_role) {
    var menu = [];
    if ((id_role === "ASSISTANT_ROLE") || (id_role === "USER_ROLE")) {
        menu.push({
            titulo: "Asistente",
            icon: "headset_mic",
            submenu: [
                { titulo: "Home", url: "/assistant/home", icon: "home" },
                { titulo: "Dashboard", url: "/assistant/dashboard", icon: "insights" },
                { titulo: "Escritorio", url: "/assistant/desktop", icon: "desktop_windows" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (id_role === "USER_ROLE") {
        menu.push({
            titulo: "Usuario",
            icon: "local_police",
            submenu: [
                { titulo: "Home", url: "/user/home", icon: "home" },
                { titulo: "Mi Perfil", url: "/user/profile", icon: "face" },
                { titulo: "Comercios", url: "/user/companies", icon: "store" },
                { titulo: "Asistentes", url: "/user/assistants", icon: "headset_mic" },
                { titulo: "Escritorios", url: "/user/desktops", icon: "important_devices" },
                { titulo: "Skills", url: "/user/skills", icon: "playlist_add_check" },
                { titulo: "Turnos", url: "/user/tickets", icon: "bookmark" },
                { titulo: "Dashboard", url: "/user/dashboard", icon: "insights" },
            ]
        }); // unshift lo coloca al princio del array, push lo coloca al final.
    }
    if (id_role === "ADMIN_ROLE") {
        menu.push({
            titulo: "Administrador",
            icon: "face",
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
    createUser,
    attachCompany,
    checkEmailExists,
    updateToken,
    loginGoogle,
    loginUser,
    obtenerMenu
};
