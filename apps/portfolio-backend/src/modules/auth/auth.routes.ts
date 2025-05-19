import express from "express"
import { AuthValidation } from "./auth.validation"
import { validateRequest } from "../../app/middleWares/validationRequest"
import { AuthController } from "./auth.controller"

const router = express.Router()

router.post('/create',
    validateRequest(AuthValidation.createUserSchema),
    AuthController.createUser
)


export const AuthRoutes = router