import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// parsers (middlewares)
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({
        success: true,
        message: "Welcome to The PH HealthCare!",
    });
});

export default app;
