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
companyRoutes.post('/create', auth_1.default.verificaToken, company_controller_1.default.createCompany);
companyRoutes.post('/update', auth_1.default.verificaToken, company_controller_1.default.updateCompany);
companyRoutes.get('/readcompanies/:idUser', company_controller_1.default.readCompanies);
companyRoutes.get('/readcompany/:idCompany', company_controller_1.default.readCompany);
companyRoutes.get('/findcompany/:pattern', company_controller_1.default.findCompany);
companyRoutes.post('/checkcompanyexists', company_controller_1.default.checkCompanyExists);
companyRoutes.delete('/deletecompany/:idCompany', company_controller_1.default.deleteCompany);
exports.default = companyRoutes;
