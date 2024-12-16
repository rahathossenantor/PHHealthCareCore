import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/uploadImage";
import specialtyControllers from "./specialty.controllers";

const router = Router();

router.get(
    "/",
    specialtyControllers.getAllSpecialties
);

router.post(
    "/create-specialty",
    auth("SUPER_ADMIN", "ADMIN"),
    upload.single("file"),
    (req: Request, _res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    specialtyControllers.createSpecialty
);

router.delete(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN"),
    specialtyControllers.deleteSingleSpecialty
);

const specialtyRoutes = router;

export default specialtyRoutes;
