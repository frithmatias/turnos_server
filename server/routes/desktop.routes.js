"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const desktop_controller_1 = __importDefault(require("../controllers/desktop.controller"));
// ROUTES
const desktopRoutes = express_1.Router();
desktopRoutes.post('/createdesktop', auth_1.default.verificaToken, desktop_controller_1.default.createDesktop);
desktopRoutes.get('/readdesktops/:idCompany', auth_1.default.verificaToken, desktop_controller_1.default.readDesktops);
desktopRoutes.delete('/deletedesktop/:idDesktop', auth_1.default.verificaToken, desktop_controller_1.default.deleteDesktop);
// Para poder usarlo desde index.ts tengo que exportar desktopRoutes
exports.default = desktopRoutes;
