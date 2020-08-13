"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
// ROUTES
const userRoutes = express_1.Router();
userRoutes.post('/updatetoken', user_controller_1.default.updateToken);
userRoutes.post('/google', user_controller_1.default.loginGoogle);
userRoutes.post('/login', user_controller_1.default.loginUser);
userRoutes.post('/register', user_controller_1.default.createUser);
userRoutes.post('/checkemailexists', user_controller_1.default.checkEmailExists);
userRoutes.post('/attach/:idUser', auth_1.default.verificaToken, user_controller_1.default.attachCompany);
exports.default = userRoutes;
