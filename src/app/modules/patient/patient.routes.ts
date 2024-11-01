import { Router } from "express";
import auth from "../../middlewares/auth";
import patientControllers from "./patient.controllers";

const router = Router();

router.get(
    "/",
    auth("SUPER_ADMIN", "ADMIN", "DOCTOR"),
    patientControllers.getAllPatients
);

router.get(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN", "DOCTOR"),
    patientControllers.getSinglePatient
);

const patientRoutes = router;

export default patientRoutes;
