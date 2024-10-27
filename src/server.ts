import app from "./app";
import { Server } from "http";
import config from "./app/config";

let server: Server;
const port = config.port;

const main: () => Promise<void> = async () => {
    server = app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    });
};
main().catch((err) => console.log(err));

process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection is detected! Server is shutting down...!");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };
    process.exit(1);
});

process.on("uncaughtException", () => {
    console.log("Uncaught Exception is detected! Server is shutting down...!");
    process.exit(1);
});
