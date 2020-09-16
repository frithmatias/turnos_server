"use strict";
const menu_model_1 = require("../models/menu.model");
// ========================================================
// Superuser Methods
// ========================================================
function readMenus(req, res) {
    menu_model_1.Menu.find({}).then(menuDB => {
        res.status(200).json({
            ok: true,
            msg: 'Menu obtenido correctamente',
            menu: menuDB
        });
    });
}
module.exports = {
    readMenus,
};
