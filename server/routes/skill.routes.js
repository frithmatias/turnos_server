"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MIDDLEWARES
const auth_1 = __importDefault(require("../middlewares/auth"));
// CONTROLLER
const skill_controller_1 = __importDefault(require("../controllers/skill.controller"));
// ROUTES
const skillRoutes = express_1.Router();
skillRoutes.post('/createskill', auth_1.default.verificaToken, skill_controller_1.default.createSkill);
skillRoutes.get('/readskills/:idCompany', skill_controller_1.default.readSkills);
skillRoutes.get('/readskillsuser/:idUser', skill_controller_1.default.readSkillsUser);
skillRoutes.delete('/deleteskill/:idSkill', auth_1.default.verificaToken, skill_controller_1.default.deleteSkill);
exports.default = skillRoutes;
