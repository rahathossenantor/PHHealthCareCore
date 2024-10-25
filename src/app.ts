import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";

const app: Application = express();

// parsers (middlewares)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Welcome to The PH HealthCare!",
    });
});

// application routes
app.use("/api/v1", router);

export default app;
