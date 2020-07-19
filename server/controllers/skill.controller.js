"use strict";
const skill_model_1 = require("../models/skill.model");
// ========================================================
// Skill Methods
// ========================================================
function createSkill(req, res) {
    var body = req.body;
    var skill = new skill_model_1.Skill({
        id_company: body.id_company,
        id_skill: body.id_skill,
        tx_skill: body.tx_skill
    });
    skill.save().then((skillSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Skill guardado correctamente',
            skill: skillSaved
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: err.message,
            skill: null
        });
    });
}
function readSkills(req, res) {
    let idCompany = req.params.idCompany;
    skill_model_1.Skill.find({ id_company: idCompany }).then((skills) => {
        res.status(200).json({
            ok: true,
            msg: 'Skills obtenidos correctamente',
            skills
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los skills',
            skills: null
        });
    });
}
function deleteSkill(req, res) {
    let idSkill = req.params.idSkill;
    skill_model_1.Skill.findByIdAndDelete(idSkill).then((skillDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Skill eliminado correctamente',
            skill: skillDeleted
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar el skill',
            skill: null
        });
    });
}
module.exports = {
    createSkill,
    readSkills,
    deleteSkill,
};
