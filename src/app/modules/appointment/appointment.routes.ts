import { Router } from "express";
import auth from "../../middlewares/auth";
import appointmentControllers from "./appointment.controllers";

const router = Router();

router.post(
    "/create-appointment",
    auth("PATIENT"),
    appointmentControllers.createAppointment
);

router.get(
    "/my-appointments",
    auth("DOCTOR", "PATIENT"),
    appointmentControllers.getMyAppointments
);

router.patch(
    "/status/:id",
    appointmentControllers.changeAppointmentStatus
);

const appointmentRoutes = router;

export default appointmentRoutes;
