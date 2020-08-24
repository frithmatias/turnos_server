"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSkillsSchema = new mongoose_1.Schema({
    id_skill: { type: String, required: [true, 'El id_skill es necesario'] },
    id_user: { type: String, required: [true, 'El id_user es necesario'] },
}, { collection: "userskills" });
userSkillsSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe de ser unico' });
exports.UserSkills = mongoose_1.model('UserSkills', userSkillsSchema);
