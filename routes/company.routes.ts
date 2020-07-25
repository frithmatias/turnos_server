import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import CompanyController from '../controllers/company.controller';

// ROUTES
const companyRoutes = Router();

companyRoutes.post('/updatecompany', mdAuth.verificaToken, CompanyController.updateCompany);
companyRoutes.get('/readcompany/:idCompany', CompanyController.readCompany);
companyRoutes.get('/findcompany/:pattern', CompanyController.findCompany);

export default companyRoutes;