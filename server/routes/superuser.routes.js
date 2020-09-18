"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const superuser_controller_1 = __importDefault(require("../controllers/superuser.controller"));
// ROUTES
const superuserRoutes = express_1.Router();
superuserRoutes.post('/createmenu', auth_1.default.verificaToken, superuser_controller_1.default.createMenu);
superuserRoutes.get('/readmenu', auth_1.default.verificaToken, superuser_controller_1.default.readMenu);
superuserRoutes.post('/updatemenu', auth_1.default.verificaToken, superuser_controller_1.default.updateMenu);
superuserRoutes.delete('/deletemenu/:idMenu', auth_1.default.verificaToken, superuser_controller_1.default.deleteMenu);
exports.default = superuserRoutes;
