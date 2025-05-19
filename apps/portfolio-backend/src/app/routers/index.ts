import express from 'express';
import { AuthRoutes } from '../../modules/auth/auth.routes';
import { BlogRoutes } from '../../modules/blogs/blogs.routes';
import { ProjectRoutes } from '../../modules/projects/projects.routes';
import { SkillRoutes } from '../../modules/skills/skills.routes';
import { ExperienceRoutes } from '../../modules/experience/experience.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/blogs',
        route:BlogRoutes
    },
    {
        path:"/projects",
        route:ProjectRoutes
    },
    {
        path:"/skills",
        route:SkillRoutes
    },
    {
        path:"/experience",
        route:ExperienceRoutes
    }
    
]



moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
