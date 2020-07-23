import { Router } from 'express';

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

export default userRoutes;