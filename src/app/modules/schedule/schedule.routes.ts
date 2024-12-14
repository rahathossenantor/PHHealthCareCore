import { Router } from "express";
import auth from "../../middlewares/auth";
import scheduleControllers from "./schedule.controllers";

const router = Router();

router.post(
    "/create-schedule",
    auth("SUPER_ADMIN", "ADMIN"),
    scheduleControllers.createSchedule
);

router.get(
    "/",
    auth("ADMIN", "DOCTOR"),
    scheduleControllers.getAllSchedules
);

router.get(
    "/:id",
    scheduleControllers.getSingleSchedule
);

router.delete(
    "/:id",
    auth("SUPER_ADMIN", "ADMIN"),
    scheduleControllers.deleteSchedule
);

const scheduleRoutes = router;

export default scheduleRoutes;
