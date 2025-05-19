import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "../../app/middleWares/validationRequest"
import auth from "../../app/middleWares/auth";
import { UserRole } from "@prisma/client";
import { SkillsValidation } from "./skills.validation";
import { multerUpload } from "../../app/config/multer-config";
import { SkillController } from "./skills.controller";


const router = express.Router()

router.post('/create',
    auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
    validateRequest(SkillsValidation.createSkillZodSchema),
  SkillController.createSkills
)

router.patch('/update/:id',
auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
    validateRequest(SkillsValidation.updateSkillZodSchema),
  SkillController.updateSkill)

router.get('/',SkillController.getSkills)

router.get('/:id',SkillController.getSkillsDetails)

router.delete('/:id',auth(UserRole.ADMIN),SkillController.deleteSkill)

export const SkillRoutes = router