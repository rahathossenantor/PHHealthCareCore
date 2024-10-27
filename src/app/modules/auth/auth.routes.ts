import { Router } from "express";
import authControllers from "./auth.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/login",
    authControllers.loginUser
);

router.post(
    "/refresh-token",
    authControllers.getRefreshToken
);

router.post(
    "/change-password",
    auth("SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"),
    authControllers.changePassword
);

router.post(
    "/forgot-password",
    authControllers.forgotPassword
);

const authRoutes = router;

export default authRoutes;
