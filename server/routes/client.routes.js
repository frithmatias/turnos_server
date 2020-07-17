"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const client_controller_1 = __importDefault(require("../controllers/client.controller"));
// ROUTES
const userRoutes = express_1.Router();
userRoutes.post('/updatetoken', auth_1.default.verificaToken, client_controller_1.default.updateToken);
userRoutes.post('/google', client_controller_1.default.loginGoogle);
userRoutes.post('/login', client_controller_1.default.loginUser);
userRoutes.post('/register', client_controller_1.default.registerUser);
userRoutes.post('/update', auth_1.default.verificaToken, client_controller_1.default.updateUser);
// Para poder usarlo desde index.ts tengo que exportar userRoutes
exports.default = userRoutes;
