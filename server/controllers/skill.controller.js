"use strict";
const skill_model_1 = require("../models/skill.model");
const company_model_1 = require("../models/company.model");
const user_model_1 = require("../models/user.model");
// ========================================================
// Skill Methods
// ========================================================
function createSkill(req, res) {
    var body = req.body;
    var skill = new skill_model_1.Skill({
        id_company: body.id_company,
        cd_skill: body.cd_skill,
        tx_skill: body.tx_skill,
        bl_generic: false
    });
    skill.save().then((skillSaved) => {
        company_model_1.Company.findById(body.id_company).then(companyDB => {
            user_model_1.User.findByIdAndUpdate(companyDB === null || companyDB === void 0 ? void 0 : companyDB.id_user, { $push: { id_skills: skillSaved._id } }).then(() => {
                res.status(200).json({
                    ok: true,
                    msg: 'Skill guardado correctamente',
                    skill: skillSaved
                });
            }).catch((err) => {
                res.status(400).json({
                    ok: true,
                    msg: 'Error al asignar el skill al usuario',
                    skill: null
                });
            });
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
    skill_model_1.Skill.find({ id_company: idCompany }).then(skillsDB => {
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
    skill_model_1.Skill.findById(idSkill).then(skillDB => {
        company_model_1.Company.findById(skillDB === null || skillDB === void 0 ? void 0 : skillDB.id_company).then(companyDB => {
            // elimino el skill del usuario
            user_model_1.User.findByIdAndUpdate(companyDB === null || companyDB === void 0 ? void 0 : companyDB.id_user, { $pull: { id_skills: idSkill } }).then(userUpdated => {
                // elimino el skill
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
            }).catch(() => {
                res.status(400).json({
                    ok: false,
                    msg: 'Error al eliminar el skill asociado al usuario',
                    skill: null
                });
            });
        }).catch(() => {
            res.status(400).json({
                ok: false,
                msg: 'Error al obtener la empresa',
                skill: null
            });
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener el skill',
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
