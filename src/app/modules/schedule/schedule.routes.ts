import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import scheduleControllers from "./schedule.controllers";

const router = Router();

router.post(
    "/create-schedule",
    auth("SUPER_ADMIN", "ADMIN"),
    scheduleControllers.createSpecialty
);

const scheduleRoutes = router;

export default scheduleRoutes;
