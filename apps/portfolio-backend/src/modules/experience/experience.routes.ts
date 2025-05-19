import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "../../app/middleWares/validationRequest"
import auth from "../../app/middleWares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../app/config/multer-config";
import { ExperienceValidation } from "./experience.validation";
import { ExperienceController } from "./experience.controller";


const router =express.Router()

router.post('/create',
  auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ExperienceValidation.createExperienceZodSchema),
  ExperienceController.createExperience
)

router.get('/',ExperienceController.getAllExperience)

router.get('/:id',ExperienceController.getExperienceDetails)

router.patch('/update/:id',auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ExperienceValidation.updateExperienceZodSchema),
  ExperienceController.updateExperience
);

router.delete('/:id',auth(UserRole.ADMIN),ExperienceController.deleteExperience)

export const ExperienceRoutes = router