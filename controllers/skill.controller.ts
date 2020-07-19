import { Request, Response } from 'express';
import { Skill } from '../models/skill.model';

// ========================================================
// Skill Methods
// ========================================================

function createSkill(req: Request, res: Response) {

    var body = req.body;

    var skill = new Skill({
        id_company: body.id_company,
        id_skill: body.id_skill,
        tx_skill: body.tx_skill
    });

    skill.save().then((skillSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Skill guardado correctamente',
            skill: skillSaved
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
    Skill.find({ id_company: idCompany }).then((skills) => {
        res.status(200).json({
            ok: true,
            msg: 'Skills obtenidos correctamente',
            skills
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los skills',
            skills: null
        })
    })
}

function deleteSkill(req: Request, res: Response) {
    let idSkill = req.params.idSkill;
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
}

export = {
    createSkill,
    readSkills,
    deleteSkill,
}
