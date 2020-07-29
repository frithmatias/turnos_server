import { Request, Response } from 'express';
import { Desktop } from '../models/desktop.model';
import { DeskStat } from '../models/deskstat.model';

// ========================================================
// Desktop Methods
// ========================================================

function createDesktop(req: Request, res: Response) {

    var body = req.body;
    var desktop = new Desktop({
        id_company: body.id_company,
        cd_desktop: body.cd_desktop,
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

    let idDesktop = req.body.idDesktop;
    let idAssistant = req.body.idAssistant;

    // actualizo el escritorio
    Desktop.findByIdAndUpdate(idDesktop, { id_assistant: idAssistant }).then(desktopTaked => {

        // actualizo el estado del escritorio
        var desktop_session = new DeskStat({
            id_desktop: idDesktop,
            id_assistant: idAssistant,
            fc_start: + new Date().getTime()
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
    })



}

function releaseDesktop(req: Request, res: Response) {

    let idDesktop = req.body.idDesktop;

    Desktop.findByIdAndUpdate(idDesktop, { id_assistant: null }).then(desktopUpdated => {
        
        if (!desktopUpdated) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el escritorio que se desea finalizar',
                desktop: null
            })
        }
                
        DeskStat.findOneAndUpdate({
            id_desktop: idDesktop,
            id_assistant: desktopUpdated.id_assistant,
            fc_end: null
        },{fc_end: + new Date().getTime()}).then(desktopReleased => {

            return res.status(200).json({
                ok: true,
                msg: 'Esctirorio finalizado correctamente',
                desktop: desktopReleased
            })

        }).catch(() => {
            return res.status(400).json({
                ok: true,
                msg: 'Error al guardar la sesion del escritorio',
                desktop: null
            })
        })


    }).catch(() => {
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar el escritorio a finalizar',
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
