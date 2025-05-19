import { z } from "zod";
const createUserSchema = z.object({
  body:z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    authSecret:z.string({required_error:"Auth Secret Required"})
  })
});

const loginUserSchema = z.object({
  body:z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    authSecret: z.string({required_error:"Auth Secret Required"})
  })
})


export const AuthValidation =  {
    createUserSchema,
    loginUserSchema
}