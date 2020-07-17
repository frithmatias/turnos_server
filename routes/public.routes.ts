import { Router, Request, Response } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import PublicController from '../controllers/public.controller';

// ROUTES
const publicRoutes = Router();
publicRoutes.get('/getuserdata/:company', PublicController.getClientData);

// Para poder usarlo desde index.ts tengo que exportar publicRoutes
export default publicRoutes;