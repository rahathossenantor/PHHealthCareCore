import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

// parsers (middlewares)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Welcome to The PH HealthCare!",
    });
});

// application routes
app.use("/api/v1", router);

// middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
