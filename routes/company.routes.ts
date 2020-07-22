import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import CompanyController from '../controllers/company.controller';

// ROUTES
const companyRoutes = Router();

companyRoutes.post('/updatecompany', mdAuth.verificaToken, CompanyController.updateCompany);
companyRoutes.get('/readcompany/:idCompany', CompanyController.readCompany);


// Para poder usarlo desde index.ts tengo que exportar companyRoutes
export default companyRoutes;