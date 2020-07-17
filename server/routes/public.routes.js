"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// CONTROLLER
const public_controller_1 = __importDefault(require("../controllers/public.controller"));
// ROUTES
const publicRoutes = express_1.Router();
publicRoutes.get('/getuserdata/:company', public_controller_1.default.getClientData);
// Para poder usarlo desde index.ts tengo que exportar publicRoutes
exports.default = publicRoutes;
