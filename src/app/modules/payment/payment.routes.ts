import { Router } from "express";
import paymentControllers from "./payment.controllers";

const router = Router();

router.post(
    "/initialize-payment/:id",
    paymentControllers.initializePayment
);

router.get(
    "/apn",
    paymentControllers.validatePayment
);

const paymentRoutes = router;

export default paymentRoutes;
