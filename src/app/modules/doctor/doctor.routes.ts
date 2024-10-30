import { Router } from "express";
import auth from "../../middlewares/auth";
import doctorControllers from "./doctor.controllers";

const router = Router();

router.get(
    "/",
    auth("SUPER_ADMIN", "ADMIN"),
    doctorControllers.getAllDoctors
);

const doctorRoutes = router;

export default doctorRoutes;
