import { NextFunction, Request, Response, Router } from "express";
import userControllers from "./user.controllers";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/uploadImage";
import requestValidator from "../../middlewares/requestValidator";
import { userValidations } from "./user.validations";

const router = Router();

router.post(
    "/create-admin",
    auth("SUPER_ADMIN", "ADMIN"),
    upload.single("file"),
    (req: Request, _res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    userControllers.createAdmin
);

router.post(
    "/create-doctor",
    auth("SUPER_ADMIN", "ADMIN"),
    upload.single("file"),
    (req: Request, _res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    requestValidator(userValidations.doctorCreateSchema),
    userControllers.createDoctor
);

const userRoutes = router;

export default userRoutes;
