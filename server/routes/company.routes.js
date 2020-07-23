"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const company_controller_1 = __importDefault(require("../controllers/company.controller"));
// ROUTES
const companyRoutes = express_1.Router();
companyRoutes.post('/updatecompany', auth_1.default.verificaToken, company_controller_1.default.updateCompany);
companyRoutes.get('/readcompany/:idCompany', company_controller_1.default.readCompany);
exports.default = companyRoutes;
