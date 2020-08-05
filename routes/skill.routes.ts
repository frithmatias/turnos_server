import { Router } from 'express';

// MIDDLEWARES
import  mdAuth  from '../middlewares/auth';

// CONTROLLER
import SkillController from '../controllers/skill.controller';

// ROUTES
const skillRoutes = Router();

skillRoutes.post('/createskill', mdAuth.verificaToken, SkillController.createSkill);
skillRoutes.get('/readskills/:idUser', SkillController.readSkills);
skillRoutes.get('/readskillscompany/:idCompany', SkillController.readSkillsCompany);
skillRoutes.delete('/deleteskill/:idSkill', mdAuth.verificaToken, SkillController.deleteSkill);

export default skillRoutes;