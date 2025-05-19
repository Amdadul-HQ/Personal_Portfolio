import express from 'express';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { BlogRoutes } from '../../modules/blogs/blogs.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/blogs',
        route:BlogRoutes
    }
    
]



moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
