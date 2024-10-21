import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./app/modules/users/user.routes";
import adminRoutes from "./app/modules/admin/admin.routes";

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
app.use("/api/v1/admins", adminRoutes);

export default app;
