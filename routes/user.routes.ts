import { Router, Request, Response } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import UserController from '../controllers/user.controller';

// ROUTES
const userRoutes = Router();
userRoutes.post('/updatetoken', mdAuth.verificaToken, UserController.updateToken);
userRoutes.post('/google', UserController.loginGoogle);
userRoutes.post('/login', UserController.loginUser);
userRoutes.post('/register', UserController.registerUser);
userRoutes.post('/update', mdAuth.verificaToken, UserController.updateUser);

// assistants
userRoutes.post('/createassistant', mdAuth.verificaToken, UserController.createAssistant);
userRoutes.get('/readassistants/:idCompany', mdAuth.verificaToken, UserController.readAssistants);
userRoutes.delete('/deleteassistant/:idAssistant', mdAuth.verificaToken, UserController.deleteAssistant);

// desktops
userRoutes.post('/createdesktop', mdAuth.verificaToken, UserController.createDesktop);
userRoutes.get('/readdesktops/:idCompany', mdAuth.verificaToken, UserController.readDesktops);
userRoutes.delete('/deletedesktop/:idDesktop', mdAuth.verificaToken, UserController.deleteDesktop);


// Para poder usarlo desde index.ts tengo que exportar userRoutes
export default userRoutes;