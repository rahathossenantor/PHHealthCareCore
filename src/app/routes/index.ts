import { Router } from "express";
import userRoutes from "../modules/users/user.routes";
import adminRoutes from "../modules/admin/admin.routes";

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
