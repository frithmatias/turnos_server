"use strict";
const desktop_model_1 = require("../models/desktop.model");
const session_model_1 = require("../models/session.model");
const company_model_1 = require("../models/company.model");
// ========================================================
// Desktop Methods
// ========================================================
function createDesktop(req, res) {
    var body = req.body;
    // if has a default desktop then remove it
    desktop_model_1.Desktop.findOneAndDelete({ id_company: body.id_company, bl_generic: true }).catch(() => {
        return res.status(400).json({
            ok: true,
            msg: 'Error al eliminar el escritorio genérico',
            skill: null
        });
    });
    var desktop = new desktop_model_1.Desktop({
        id_company: body.id_company,
        cd_desktop: body.cd_desktop,
        id_session: null
    });
    desktop.save().then((desktopSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Escritorio guardado correctamente',
            desktop: desktopSaved
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: err.message,
            desktop: null
        });
    });
}
function readDesktopsUser(req, res) {
    let idUser = req.params.idUser;
    company_model_1.Company.find({ id_user: idUser }).then(companiesDB => {
        return companiesDB.map(company => company._id);
    }).then(resp => {
        desktop_model_1.Desktop.find({ id_company: { $in: resp } }).populate('id_company').then(desktopsDB => {
            if (!desktopsDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existen escritorios para la empresa seleccionada',
                    desktops: null
                });
            }
            return res.status(200).json({
                ok: true,
                msg: 'Escritorios obtenidos correctamente',
                desktops: desktopsDB
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar los escritorios para las empresas del user',
                desktops: null
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al consultar las empresas del user',
                desktops: null
            });
        });
    });
}
function readDesktops(req, res) {
    let idCompany = req.params.idCompany;
    desktop_model_1.Desktop.find({ id_company: idCompany })
        .populate({
        path: 'id_session',
        populate: { path: 'id_assistant' }
    })
        .then(desktopsDB => {
        if (!desktopsDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existen escritorios para la empresa seleccionada',
                desktops: null
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Escritorios obtenidos correctamente',
            desktops: desktopsDB
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar los escritorios para las empresas del user',
            desktops: null
        });
    });
}
function deleteDesktop(req, res) {
    let idDesktop = req.params.idDesktop;
    desktop_model_1.Desktop.findById(idDesktop).then(desktopDB => {
        desktop_model_1.Desktop.find({ id_company: desktopDB === null || desktopDB === void 0 ? void 0 : desktopDB.id_company }).then(desktopsDB => {
            // si queda un solo escritorio, antes de borrarlo creo un genérico.
            let generics = desktopsDB.filter(desktop => desktop.bl_generic === true).length;
            let customs = desktopsDB.filter(desktop => desktop.bl_generic === false).length;
            if (customs === 1 && generics === 0) { // antes de borrar el último creo el genérico
                const desktop = new desktop_model_1.Desktop();
                desktop.id_company = desktopDB === null || desktopDB === void 0 ? void 0 : desktopDB.id_company;
                desktop.cd_desktop = '1';
                desktop.id_session = null;
                desktop.bl_generic = true;
                desktop.save().catch(() => {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se elimino el ultimo escritorio porque no se pudo crear el genérico.',
                        skill: null
                    });
                });
            }
            desktop_model_1.Desktop.findByIdAndDelete(idDesktop).then((desktopDeleted) => {
                res.status(200).json({
                    ok: true,
                    msg: 'Escritorio eliminado correctamente',
                    desktop: desktopDeleted
                });
            }).catch(() => {
                res.status(400).json({
                    ok: false,
                    msg: 'Error al eliminar el escritorio',
                    desktop: null
                });
            });
        });
    });
}
function takeDesktop(req, res) {
    let idDesktop = req.body.idDesktop;
    let idAssistant = req.body.idAssistant;
    // actualizo el estado del escritorio
    var session = new session_model_1.Session({
        id_desktop: idDesktop,
        id_assistant: idAssistant,
        fc_start: +new Date().getTime(),
        fc_end: null
    });
    session.save().then(sessionSaved => {
        // actualizo el escritorio
        desktop_model_1.Desktop.findByIdAndUpdate(idDesktop, { id_session: sessionSaved._id }, { new: true })
            .populate({
            path: 'id_session',
            populate: { path: 'id_assistant id_desktop' }
        })
            .then(desktopTaked => {
            return res.status(200).json({
                ok: true,
                msg: 'Se asigno el asistente al escritorio',
                desktop: desktopTaked
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al registrar la sesión en el escritorio',
                desktop: null
            });
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al guardar la sesion del escritorio',
            desktop: null
        });
    });
}
function releaseDesktop(req, res) {
    let idDesktop = req.body.idDesktop;
    desktop_model_1.Desktop.findByIdAndUpdate(idDesktop, { id_session: null }).then(desktopUpdated => {
        if (!desktopUpdated) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el escritorio que se desea finalizar',
                desktop: null
            });
        }
        session_model_1.Session.findByIdAndUpdate(desktopUpdated.id_session, { fc_end: +new Date().getTime() }).then(desktopReleased => {
            return res.status(200).json({
                ok: true,
                msg: 'Esctirorio finalizado correctamente',
                desktop: desktopReleased
            });
        }).catch(() => {
            return res.status(400).json({
                ok: true,
                msg: 'Error al guardar la sesion del escritorio',
                desktop: null
            });
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar el escritorio a finalizar',
            desktop: null
        });
    });
}
module.exports = {
    createDesktop,
    readDesktopsUser,
    readDesktops,
    deleteDesktop,
    takeDesktop,
    releaseDesktop
};
