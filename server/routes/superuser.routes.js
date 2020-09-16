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
superuserRoutes.get('/readmenus', auth_1.default.verificaToken, superuser_controller_1.default.readMenus);
exports.default = superuserRoutes;
