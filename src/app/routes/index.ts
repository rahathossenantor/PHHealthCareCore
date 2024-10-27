import { Router } from "express";
import userRoutes from "../modules/users/user.routes";
import adminRoutes from "../modules/admin/admin.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: userRoutes
    },
    {
        path: "/admins",
        route: adminRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
