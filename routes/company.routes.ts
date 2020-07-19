import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import CompanyController from '../controllers/company.controller';

// ROUTES
const companyRoutes = Router();

companyRoutes.post('/update', mdAuth.verificaToken, CompanyController.updateCompany);

// Para poder usarlo desde index.ts tengo que exportar companyRoutes
export default companyRoutes;