import { Router } from "express";
import auth from "../../middlewares/auth";
import reviewControllers from "./review.controllers";

const router = Router();

router.post(
    "/create-review",
    auth("PATIENT"),
    reviewControllers.createReview
);

const reviewRoutes = router;

export default reviewRoutes;
