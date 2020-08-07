"use strict";
const skill_model_1 = require("../models/skill.model");
const company_model_1 = require("../models/company.model");
// ========================================================
// Skill Methods
// ========================================================
function createSkill(req, res) {
    var body = req.body;
    var skill = new skill_model_1.Skill({
        id_company: body.id_company,
        cd_skill: body.cd_skill,
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
    skill_model_1.Skill.find({ id_company: idCompany }).populate('id_company').then(skillsDB => {
        if (!skillsDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen skills para la empresa seleccionada',
                skills: null
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Skills obtenidos correctamente',
            skills: skillsDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar los skills para las empresas del user',
            skills: null
        });
    });
}
function readSkillsUser(req, res) {
    let idUser = req.params.idUser;
    company_model_1.Company.find({ id_user: idUser }).then(companiesDB => {
        return companiesDB.map(company => company._id);
    }).then(resp => {
        skill_model_1.Skill.find({ id_company: { $in: resp } }).populate('id_company').then(skillsDB => {
            if (!skillsDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen skills para la empresa seleccionada',
                    skills: null
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Skills obtenidos correctamente',
                skills: skillsDB
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los skills para las empresas del user',
                skills: null
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar las empresas del user',
                skills: null
            });
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
    readSkillsUser,
    readSkills,
    deleteSkill,
};
