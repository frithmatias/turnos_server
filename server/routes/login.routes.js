"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const login_controller_1 = __importDefault(require("../controllers/login.controller"));
// ROUTES
const loginRoutes = express_1.Router();
loginRoutes.post('/updatetoken', auth_1.default.verificaToken, login_controller_1.default.updateToken);
loginRoutes.post('/google', login_controller_1.default.loginGoogle);
loginRoutes.post('/', login_controller_1.default.login);
// Para poder usarlo desde index.ts tengo que exportar loginRoutes
exports.default = loginRoutes;
