import { Router } from "express";
import userControllers from "./user.controllers";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/uploadImage";

const router = Router();

router.post(
    "/create-admin",
    auth("SUPER_ADMIN", "ADMIN"),
    upload.single("file"),
    userControllers.createAdmin
);

const userRoutes = router;

export default userRoutes;
