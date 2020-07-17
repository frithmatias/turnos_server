"use strict";
const user_model_1 = require("../models/user.model");
function getClientData(req, res) {
    var company = String(req.params.company);
    user_model_1.User.findOne({ empresa: company }, 'email empresa', (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar el usuario",
                errors: err
            });
        }
        if (!user) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con el id solicitado"
            });
        }
        user.password = ':)';
        res.status(200).json({
            ok: true,
            user
        });
    });
}
module.exports = {
    getClientData
};
