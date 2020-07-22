import { Request, Response } from 'express';
import { Desktop } from '../models/desktop.model';
import { DeskStat } from '../models/deskstat.model';

// ========================================================
// Desktop Methods
// ========================================================

function createDesktop(req: Request, res: Response) {
    console.log(req.body)
    var body = req.body;
    var desktop = new Desktop({
        id_company: body.id_company,
        id_desktop: body.id_desktop,
        id_assistant: body.id_assistant
    });

    desktop.save().then((desktopSaved) => {
        res.status(200).json({
            ok: true,
            msg: 'Escritorio guardado correctamente',
            desktop: desktopSaved
        })
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            msg: err.message,
            desktop: null
        })
    })
}

function readDesktops(req: Request, res: Response) {
    let idCompany = req.params.idCompany;
    Desktop.find({ id_company: idCompany }).then((desktops) => {
        res.status(200).json({
            ok: true,
            msg: 'Escritorios obtenidos correctamente',
            desktops
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al consultar los escritorios',
            desktops: null
        })
    })
}

function deleteDesktop(req: Request, res: Response) {
    let idDesktop = req.params.idDesktop;
    Desktop.findByIdAndDelete(idDesktop).then((desktopDeleted) => {
        res.status(200).json({
            ok: true,
            msg: 'Escritorio eliminado correctamente',
            desktop: desktopDeleted
        })
    }).catch(() => {
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar el escritorio',
            desktop: null
        })
    })
}

function takeDesktop(req: Request, res: Response) {

    var desktop = new DeskStat({
        id_company: req.body.idCompany,
        id_desktop: req.body.idDesktop,
        id_assistant: req.body.idAssistant,
        fc_start: + new Date().getTime()
    });

    desktop.save().then((desktopSaved) => {

        return res.status(200).json({
            ok: true,
            msg: 'Se asigno el asistente al escritorio',
            desktop: desktopSaved
        });

    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al guardar el asistente para el escritorio',
            desktop: null
        });
    });
}

function releaseDesktop(req: Request, res: Response ) {
    
    let idCompany = req.body.idCompany;
    let idDesktop = req.body.idDesktop;
    let idAssistant = req.body.idAssistant;
    console.log('FINALIZANDO ESCTIRORIO', idDesktop, idCompany, idAssistant)
    DeskStat.findOneAndUpdate(
        {id_company: idCompany, id_desktop: idDesktop, id_assistant: idAssistant}, 
        {fc_end: + new Date().getTime()}
    ).then(desktopReleased => {
        return res.status(200).json({
            ok: true,
            msg: 'Esctirorio finalizado correctamente',
            desktop: desktopReleased
        })
    }).catch(()=> {
        return res.status(400).json({
            ok: true,
            msg: 'No se pudo finalizar el escritorio',
            desktop: null
        })
    })
}

export = {
    createDesktop,
    readDesktops,
    deleteDesktop,
    takeDesktop,
    releaseDesktop
}
