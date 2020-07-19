import { Request, Response } from 'express';
import { Desktop } from '../models/desktop.model';

// ========================================================
// Desktop Methods
// ========================================================

function createDesktop(req: Request, res: Response) {

    var body = req.body;
    var desktop = new Desktop({
        id_company: body.id_company,
        id_desktop: body.id_desktop,
        id_type: body.id_type
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

export = {
    createDesktop,
    readDesktops,
    deleteDesktop,
}
