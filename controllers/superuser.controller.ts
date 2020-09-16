import { Request, Response } from 'express';
import { Menu } from '../models/menu.model';

// ========================================================
// Superuser Methods
// ========================================================

function readMenus(req: Request, res: Response) {

Menu.find({}).then(menuDB => {
    res.status(200).json({
        ok: true,
        msg: 'Menu obtenido correctamente',
        menu: menuDB
    })
})
}



export = {
    readMenus,
}
