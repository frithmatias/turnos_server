"use strict";
const company_model_1 = require("../models/company.model");
// ========================================================
// Company Methods
// ========================================================
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
function updateCompany(req, res) {
    var body = req.body;
    var id = req.params.id;
    // Verifico que el id existe
    company_model_1.Company.findById(id, (err, company) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: "Error al buscar un company",
                company: null
            });
        }
        if (!company) {
            return res.status(400).json({
                ok: false,
                msg: "No existe la empresa",
                company: null
            });
        }
        company.tx_company_name = body.tx_company_name;
        company.tx_address_street = body.tx_address_street;
        company.tx_address_number = body.tx_address_number;
        company.save((err, companySaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: "Error al actualizar la empresa",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                msg: "Empresa guardada correctamente",
                company: companySaved
            });
        });
    });
}
module.exports = {
    readCompany,
    updateCompany,
};
