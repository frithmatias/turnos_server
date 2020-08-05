"use strict";
const company_model_1 = require("../models/company.model");
const user_model_1 = require("../models/user.model");
const skill_model_1 = require("../models/skill.model");
const desktop_model_1 = require("../models/desktop.model");
// ========================================================
// Company Methods
// ========================================================
function createCompany(req, res) {
    // Save Company
    var body = req.body;
    var company = new company_model_1.Company({
        id_user: body.company.id_user,
        tx_company_name: body.company.tx_company_name,
        tx_public_name: body.company.tx_public_name,
        tx_address_street: body.company.tx_address_street,
        tx_address_number: body.company.tx_address_number,
        cd_city: body.company.cd_city,
        fc_att_start: null,
        fc_att_end: null
    });
    company.save().then((companySaved) => {
        return res.status(200).json({
            ok: true,
            msg: 'Empresa creada correctamente',
            company: companySaved
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            msg: err,
            company: null
        });
    });
}
function readCompany(req, res) {
    var idCompany = String(req.params.idCompany);
    company_model_1.Company.findOne({ tx_public_name: idCompany }).then(companyDB => {
        if (!companyDB) {
            return res.status(400).json({
                ok: false,
                msg: "No existe la empresa",
                company: null
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Empresa obtenida correctamente',
            company: companyDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: "Error al buscar el usuario",
            company: null
        });
    });
}
function readCompanies(req, res) {
    var idUser = String(req.params.idUser);
    company_model_1.Company.find({ id_user: idUser }).then(companiesDB => {
        if (!companiesDB) {
            return res.status(400).json({
                ok: false,
                msg: "No existen empresas asociadas al usuario",
                companies: null
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Empresas obtenidas correctamente',
            companies: companiesDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: "Error al buscar empresas asociadas a un usuario",
            companies: null
        });
    });
}
function findCompany(req, res) {
    var pattern = String(req.params.pattern);
    var regex = new RegExp(pattern, 'i');
    company_model_1.Company.find({ tx_company_name: regex }).then(companiesDB => {
        if (!companiesDB) {
            return res.status(200).json({
                ok: false,
                msg: "No existe la empresa",
                companies: null
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Empresa obtenida correctamente',
            companies: companiesDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: "Error al buscar el usuario",
            companies: null
        });
    });
}
function updateCompany(req, res) {
    var body = req.body;
    company_model_1.Company.findByIdAndUpdate(body._id, {
        tx_company_name: body.tx_company_name,
        tx_public_name: body.tx_public_name,
        cd_city: body.cd_city,
        tx_address_street: body.tx_address_street,
        tx_address_number: body.tx_address_number
    }).then(companyDB => {
        if (!companyDB) {
            return res.status(400).json({
                ok: false,
                msg: "No existe la empresa que desea actualizar",
                company: null
            });
        }
        return res.status(200).json({
            ok: true,
            msg: "Empresa actualizada correctamente",
            company: companyDB
        });
    });
}
function deleteCompany(req, res) {
    var idCompany = req.params.idCompany;
    console.log('ELIMINANDO', idCompany);
    let users = user_model_1.User.deleteMany({ id_company: idCompany }).then(usersDeleted => usersDeleted);
    let skills = skill_model_1.Skill.deleteMany({ id_company: idCompany }).then(usersDeleted => usersDeleted);
    let desktops = desktop_model_1.Desktop.deleteMany({ id_company: idCompany }).then(usersDeleted => usersDeleted);
    let company = company_model_1.Company.findByIdAndDelete(idCompany).then(usersDeleted => usersDeleted);
    Promise.all([users, skills, desktops, company]).then(resp => {
        return res.status(200).json({
            ok: true,
            msg: 'La empresa y sus vínculos fueron eliminados correctamente',
            company: {
                company: resp[3],
                childs: { users: resp[0], skills: resp[1], desktops: resp[2] }
            }
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar la empresa o uno de sus vínculos'
        });
    });
}
function checkCompanyExists(req, res) {
    let pattern = req.body.pattern;
    company_model_1.Company.findOne({ tx_public_name: pattern }).then(companyDB => {
        if (!companyDB) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe la empresa'
            });
        }
        return res.status(200).json({
            ok: false,
            msg: 'La empresa ya existe.',
            company: companyDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar si existe la empresa'
        });
    });
}
module.exports = {
    createCompany,
    readCompany,
    readCompanies,
    findCompany,
    updateCompany,
    deleteCompany,
    checkCompanyExists
};
