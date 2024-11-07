import { Router } from "express";
import auth from "../../middlewares/auth";
import appointmentControllers from "./appointment.controllers";

const router = Router();

router.post(
    "/create-appointment",
    auth("PATIENT"),
    appointmentControllers.createAppointment
);

const appointmentRoutes = router;

export default appointmentRoutes;
