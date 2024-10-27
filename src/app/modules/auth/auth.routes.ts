import { Router } from "express";
import authControllers from "./auth.controllers";

const router = Router();

router.post(
    "/login",
    authControllers.loginUser
);

const authRoutes = router;

export default authRoutes;
