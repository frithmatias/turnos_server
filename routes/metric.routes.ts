import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import MetricController from '../controllers/metric.controller';

// ROUTES
const metricRoutes = Router();

metricRoutes.get('/gettickets/:idUser', mdAuth.verificaToken, MetricController.getTickets);




export default metricRoutes;