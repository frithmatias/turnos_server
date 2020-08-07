"use strict";
const company_model_1 = require("../models/company.model");
const contact_model_1 = require("../models/contact.model");
function getClientData(req, res) {
    var company = String(req.params.company);
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
            msg: "Error al buscar el user",
            company: null
        });
    });
}
function postContact(req, res) {
    let contact = new contact_model_1.Contact();
    contact.tx_type = req.body.tx_type;
    contact.tx_message = req.body.tx_message;
    contact.tx_name = req.body.tx_name;
    contact.tx_email = req.body.tx_email;
    contact.tx_phone = req.body.tx_phone;
    contact.save().then(contactSaved => {
        return res.status(200).json({
            ok: true,
            msg: 'Contacto guardado correctamente',
            contact: contactSaved._id
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'Error al guardar el contacto',
            contact: null
        });
    });
}
module.exports = {
    getClientData,
    postContact
};
