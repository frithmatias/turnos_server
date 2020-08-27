"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const metric_controller_1 = __importDefault(require("../controllers/metric.controller"));
// ROUTES
const metricRoutes = express_1.Router();
metricRoutes.get('/gettickets/:idUser', auth_1.default.verificaToken, metric_controller_1.default.getTickets);
exports.default = metricRoutes;
