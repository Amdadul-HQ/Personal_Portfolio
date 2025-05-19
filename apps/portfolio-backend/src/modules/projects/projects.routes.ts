import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "../../app/middleWares/validationRequest"
import auth from "../../app/middleWares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../app/config/multer-config";
import { ProjectValidation } from "./projects.validation";
import { ProjectController } from "./projects.controller";


const router = express.Router()


router.post('/create',
    auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProjectValidation.createProjectZodSchema),
  ProjectController.createProject
)

router.get('/',ProjectController.getAllProjects)

router.get('/:id',ProjectController.getProjectDetails)

router.patch('/update/:id',
  auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProjectValidation.updateProjectZodSchema),
  ProjectController.updateProject
)

router.delete('/:id',auth(UserRole.ADMIN),ProjectController.deleteProject)


export const ProjectRoutes = router