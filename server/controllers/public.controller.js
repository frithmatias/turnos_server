"use strict";
const company_model_1 = require("../models/company.model");
function getClientData(req, res) {
    var company = String(req.params.company);
    console.log(company);
    company_model_1.Company.findOne({ tx_company_name: company }).then(companyDB => {
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
module.exports = {
    getClientData
};
