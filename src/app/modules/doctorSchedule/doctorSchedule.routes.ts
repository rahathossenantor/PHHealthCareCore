import { Router } from "express";
import auth from "../../middlewares/auth";
import doctorScheduleControllers from "./doctorSchedule.controllers";

const router = Router();

router.post(
    "/create-doctor-schedule",
    auth("DOCTOR"),
    doctorScheduleControllers.createDoctorSchedule
);

const doctorScheduleRoutes = router;

export default doctorScheduleRoutes;
