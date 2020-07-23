"use strict";
const desktop_model_1 = require("../models/desktop.model");
const deskstat_model_1 = require("../models/deskstat.model");
// ========================================================
// Desktop Methods
// ========================================================
function createDesktop(req, res) {
    var body = req.body;
    var desktop = new desktop_model_1.Desktop({
        id_company: body.id_company,
        cd_desktop: body.cd_desktop,
        id_assistant: body.id_assistant
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
function readDesktops(req, res) {
    let idCompany = req.params.idCompany;
    desktop_model_1.Desktop.find({ id_company: idCompany }).then((desktops) => {
        res.status(200).json({
            ok: true,
            msg: 'Escritorios obtenidos correctamente',
            desktops
        });
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los escritorios',
            desktops: null
        });
    });
}
function deleteDesktop(req, res) {
    let idDesktop = req.params.idDesktop;
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
}
function takeDesktop(req, res) {
    let idCompany = req.body.idCompany;
    let idDesktop = req.body.idDesktop;
    let idAssistant = req.body.idAssistant;
    // actualizo el escritorio
    desktop_model_1.Desktop.findByIdAndUpdate(idDesktop, { id_assistant: idAssistant }).then(desktopUpdated => {
        // actualizo el estado del escritorio
        var desktop_session = new deskstat_model_1.DeskStat({
            id_company: idCompany,
            id_desktop: idDesktop,
            id_assistant: idAssistant,
            fc_start: +new Date().getTime()
        });
        desktop_session.save().then((sessionSaved) => {
            return res.status(200).json({
                ok: true,
                msg: 'Se asigno el asistente al escritorio',
                desktop: desktopUpdated
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar el asistente para el escritorio',
                desktop: null
            });
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'No existen escritorios disponibles',
            desktop: null
        });
    });
}
function releaseDesktop(req, res) {
    let desktop = req.body;
    desktop_model_1.Desktop.findByIdAndUpdate(desktop._id, { id_assistant: null }).then(desktopUpdated => {
        if (!desktopUpdated) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el escritorio que se desea finalizar',
                desktop: null
            });
        }
        else {
            deskstat_model_1.DeskStat.findOneAndUpdate(
            // find session
            {
                id_company: desktop.id_company,
                id_desktop: desktop._id,
                id_assistant: desktop.id_assistant
            }, {
                // update
                id_assistant: null
            }).then(desktopReleased => {
                return res.status(200).json({
                    ok: true,
                    msg: 'Esctirorio finalizado correctamente',
                    desktop: desktopReleased
                });
            }).catch(() => {
                return res.status(400).json({
                    ok: true,
                    msg: 'No se pudo finalizar el escritorio',
                    desktop: null
                });
            });
        }
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
    readDesktops,
    deleteDesktop,
    takeDesktop,
    releaseDesktop
};
