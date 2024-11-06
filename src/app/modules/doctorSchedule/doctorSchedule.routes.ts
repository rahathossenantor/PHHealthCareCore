import { Router } from "express";
import auth from "../../middlewares/auth";
import doctorScheduleControllers from "./doctorSchedule.controllers";

const router = Router();

router.post(
    "/create-doctor-schedule",
    auth("DOCTOR"),
    doctorScheduleControllers.createDoctorSchedule
);

router.get(
    "/",
    doctorScheduleControllers.getAllDoctorSchedules
);

router.get(
    "/my-schedules",
    auth("DOCTOR"),
    doctorScheduleControllers.getMySchedules
);

router.get(
    "/:id",
    auth("DOCTOR"),
    doctorScheduleControllers.deleteMySchedule
);

const doctorScheduleRoutes = router;

export default doctorScheduleRoutes;
