"use strict";
const desktop_model_1 = require("../models/desktop.model");
const deskstat_model_1 = require("../models/deskstat.model");
const company_model_1 = require("../models/company.model");
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
    desktop_model_1.Desktop.find({ id_company: idCompany }).populate('id_assistant').then(desktopsDB => {
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
    let idDesktop = req.body.idDesktop;
    let idAssistant = req.body.idAssistant;
    // actualizo el escritorio
    desktop_model_1.Desktop.findByIdAndUpdate(idDesktop, { id_assistant: idAssistant }).then(desktopTaked => {
        // actualizo el estado del escritorio
        var desktop_session = new deskstat_model_1.DeskStat({
            id_desktop: idDesktop,
            id_assistant: idAssistant,
            fc_start: +new Date().getTime()
        });
        desktop_session.save().then((sessionSaved) => {
            return res.status(200).json({
                ok: true,
                msg: 'Se asigno el asistente al escritorio',
                desktop: desktopTaked
            });
        }).catch(() => {
            return res.status(500).json({
                ok: false,
                msg: 'Error al guardar la sesion del escritorio',
                desktop: null
            });
        });
    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al intentar tomar el escritorio',
            desktop: null
        });
    });
}
function releaseDesktop(req, res) {
    let idDesktop = req.body.idDesktop;
    desktop_model_1.Desktop.findByIdAndUpdate(idDesktop, { id_assistant: null }).then(desktopUpdated => {
        if (!desktopUpdated) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el escritorio que se desea finalizar',
                desktop: null
            });
        }
        deskstat_model_1.DeskStat.findOneAndUpdate({
            id_desktop: idDesktop,
            id_assistant: desktopUpdated.id_assistant,
            fc_end: null
        }, { fc_end: +new Date().getTime() }).then(desktopReleased => {
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
