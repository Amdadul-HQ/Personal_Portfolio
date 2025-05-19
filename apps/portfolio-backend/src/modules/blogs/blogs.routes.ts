import express, { NextFunction, Request, Response } from "express"
import { validateRequest } from "../../app/middleWares/validationRequest"
import auth from "../../app/middleWares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../app/config/multer-config";
import { BlogValidation } from "./blogs.validation";
import { BlogController } from "./blogs.controller";

const router = express.Router()

router.get('/',BlogController.getBlogs)

router.post('/create',auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog
)

router.get('/:id',BlogController.getBlogDetails)

router.patch('/update/:id',auth(UserRole.ADMIN),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(BlogValidation.updateblogZodSchema),
  BlogController.updateBlog
)

router.delete('/:id',auth(UserRole.ADMIN),BlogController.deleteBlog)

export const BlogRoutes = router;