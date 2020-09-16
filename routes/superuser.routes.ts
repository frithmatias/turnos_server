import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import SuperuserController from '../controllers/superuser.controller';

// ROUTES
const superuserRoutes = Router();

superuserRoutes.get('/readmenus', mdAuth.verificaToken, SuperuserController.readMenus);

export default superuserRoutes;