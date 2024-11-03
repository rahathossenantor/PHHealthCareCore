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

router.patch(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN", "DOCTOR"),
    patientControllers.updatePatient
);

router.delete(
    "/:id",
    patientControllers.deletePatient
);

const patientRoutes = router;

export default patientRoutes;
