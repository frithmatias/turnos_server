"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const assistant_controller_1 = __importDefault(require("../controllers/assistant.controller"));
// ROUTES
const assistantRoutes = express_1.Router();
// crud
assistantRoutes.post('/createassistant', auth_1.default.verificaToken, assistant_controller_1.default.createAssistant);
assistantRoutes.post('/updateassistant', auth_1.default.verificaToken, assistant_controller_1.default.updateAssistant);
assistantRoutes.get('/readassistants/:idCompany', auth_1.default.verificaToken, assistant_controller_1.default.readAssistants);
assistantRoutes.delete('/deleteassistant/:idAssistant', auth_1.default.verificaToken, assistant_controller_1.default.deleteAssistant);
assistantRoutes.get('/readactivesessionsbyskill/:idSkill', assistant_controller_1.default.readActiveSessionsBySkill);
assistantRoutes.get('/readassistantsuser/:idUser', auth_1.default.verificaToken, assistant_controller_1.default.readAssistantsUser);
exports.default = assistantRoutes;
