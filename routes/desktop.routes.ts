import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import DesktopController from '../controllers/desktop.controller';

// ROUTES
const desktopRoutes = Router();

desktopRoutes.post('/createdesktop', mdAuth.verificaToken, DesktopController.createDesktop);
desktopRoutes.get('/readdesktops/:idUser', mdAuth.verificaToken, DesktopController.readDesktops);
desktopRoutes.get('/readdesktopscompany/:idCompany', mdAuth.verificaToken, DesktopController.readDesktopsCompany);

desktopRoutes.delete('/deletedesktop/:idDesktop', mdAuth.verificaToken, DesktopController.deleteDesktop);
desktopRoutes.post('/takedesktop', mdAuth.verificaToken, DesktopController.takeDesktop);
desktopRoutes.post('/releasedesktop', mdAuth.verificaToken, DesktopController.releaseDesktop);

export default desktopRoutes;