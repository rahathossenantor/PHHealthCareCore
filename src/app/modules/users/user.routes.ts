import { Router } from "express";
import userControllers from "./user.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/create-admin",
    auth("ADMIN"),
    userControllers.createAdmin
);

const userRoutes = router;

export default userRoutes;
