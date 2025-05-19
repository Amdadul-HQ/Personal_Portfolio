import express from "express"
import { validateRequest } from "../../app/middleWares/validationRequest"
import { AuthValidation } from "./auth.validation"
import { AuthController } from "./auth.controller"

const router = express.Router()

router.post('/create',
    validateRequest(AuthValidation.createUserSchema),
    AuthController.createUser
);

router.post('/login',
    validateRequest(AuthValidation.loginUserSchema), 
    AuthController.logingUser);
router.post('/refesh-token', AuthController.refeshToken);


export const AuthRoutes = router