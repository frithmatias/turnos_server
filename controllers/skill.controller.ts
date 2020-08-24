import { Request, Response } from 'express';
import { Skill } from '../models/skill.model';
import { Company } from '../models/company.model';
import { User } from '../models/user.model';

// ========================================================
// Skill Methods
// ========================================================


function createSkill(req: Request, res: Response) {

    var body = req.body;

    var skill = new Skill({
        id_company: body.id_company,
        cd_skill: body.cd_skill,
        tx_skill: body.tx_skill,
        bl_generic: false
    });

    skill.save().then((skillSaved) => {

        Company.findById(body.id_company).then(companyDB => {
            User.findByIdAndUpdate(companyDB?.id_user, { $push: { id_skills: skillSaved._id } }).then(() => {

                res.status(200).json({
                    ok: true,
                    msg: 'Skill guardado correctamente',
                    skill: skillSaved
                })

            }).catch((err) => {

                res.status(400).json({
                    ok: true,
                    msg: 'Error al asignar el skill al usuario',
                    skill: null
                })

            })
        })
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: err.message,
            skill: null
        })
    })
}

function readSkills(req: Request, res: Response) {

    let idCompany = req.params.idCompany;

    Skill.find({ id_company: idCompany }).then(skillsDB => {
        if (!skillsDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen skills para la empresa seleccionada',
                skills: null
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Skills obtenidos correctamente',
            skills: skillsDB
        })
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar los skills para las empresas del user',
            skills: null
        })
    })
}

function readSkillsUser(req: Request, res: Response) {
    let idUser = req.params.idUser;

    Company.find({ id_user: idUser }).then(companiesDB => {
        return companiesDB.map(company => company._id)
    }).then(resp => {
        Skill.find({ id_company: { $in: resp } }).populate('id_company').then(skillsDB => {
            if (!skillsDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen skills para la empresa seleccionada',
                    skills: null
                })
            }
            return res.status(200).json({
                ok: true,
                msg: 'Skills obtenidos correctamente',
                skills: skillsDB
            })
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los skills para las empresas del user',
                skills: null
            })
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar las empresas del user',
                skills: null
            })
        })
    })
}

function deleteSkill(req: Request, res: Response) {
    let idSkill = req.params.idSkill;

    
    Skill.findById(idSkill).then(skillDB => {
        Company.findById(skillDB?.id_company).then(companyDB => {
            // elimino el skill del usuario
            User.findByIdAndUpdate(companyDB?.id_user, { $pull: { id_skills: idSkill } }).then(userUpdated => {
                // elimino el skill
                Skill.findByIdAndDelete(idSkill).then((skillDeleted) => {
                    res.status(200).json({
                        ok: true,
                        msg: 'Skill eliminado correctamente',
                        skill: skillDeleted
                    })
                }).catch(() => {
                    res.status(400).json({
                        ok: false,
                        msg: 'Error al eliminar el skill',
                        skill: null
                    })
                })

            }).catch(() => {
                res.status(400).json({
                    ok: false,
                    msg: 'Error al eliminar el skill asociado al usuario',
                    skill: null
                })
            })
        }).catch(()=>{
            res.status(400).json({
                ok: false,
                msg: 'Error al obtener la empresa',
                skill: null
            })
        })
    }).catch(()=>{
        res.status(400).json({
            ok: false,
            msg: 'Error al obtener el skill',
            skill: null
        })
    })


}

export = {
    createSkill,
    readSkillsUser,
    readSkills,
    deleteSkill,
}
