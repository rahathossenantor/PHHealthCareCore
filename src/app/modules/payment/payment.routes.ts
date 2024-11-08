import { Router } from "express";
import paymentControllers from "./payment.controllers";

const router = Router();

router.get(
    "/initialize-payment/:id",
    paymentControllers.initializePayment
);

const paymentRoutes = router;

export default paymentRoutes;
