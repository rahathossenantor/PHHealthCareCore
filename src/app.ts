import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./app/modules/users/user.routes";

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

app.use("/api/v1/users", userRoutes);

export default app;
