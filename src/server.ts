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


/*

NODE_ENV="development"
DATABASE_URL="postgresql://postgres.dkaflzkknvofeorlbpnk:3LkbLHKAAN3PW4Kb@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.dkaflzkknvofeorlbpnk:3LkbLHKAAN3PW4Kb@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
ENABLE_PRISMA_CACHING=false
PORT=5000
DEFAULT_PASSWORD="12345"
JWT_ACCESS_SECRET="20e88d228f596cec04308140cf54db057551601667822de57fb99d97dbbe6757df9ec4ebf452fc7008152eaf8be5a873a4faa
090af83692479fb03ff8f1342c7"
JWT_REFRESH_SECRET="2b799815ca64f1b2f3af1969e846baa1f13d48eb35f38cd17f25b8db5355957b7c07b491efa1a3bf195cbd9963d3101da6f0c
95a31405f6ff2f56fbe9d19e1cf"
JWT_RESET_PASS_ACCESS_SECRET="sdgfjasdgvkasveqryyfvsbf"
JWT_ACCESS_EXPIRES_IN="10d"
JWT_REFRESH_EXPIRES_IN="30d"
JWT_RESET_PASS_ACCESS_EXPIRES_IN="5m"
RESET_PASSWORD_URL="http://localhost:3000"
SMTP_USER="md.rahathossenantor@gmail.com"
SMTP_PASS="xsopwppohqlbatmb"
CLOUDINARY_CLOUD_NAME="dboonmy3k"
CLOUDINARY_API_KEY="278449434777944"
CLOUDINARY_API_SECRET="3_-Ob-wAbdhTNMuL1_h65SMVmuY"
SSL_STORE_ID="mdrah672d0f58943b2"
SSL_STORE_PASS="mdrah672d0f58943b2@ssl"
SSL_SUCCESS_URL="http://localhost:3000/payment?status=success"
SSL_FAIL_URL="http://localhost:3000/payment?status=fail"
SSL_CANCEL_URL="http://localhost:3000/payment?status=cancel"
SSL_PAYMENT_API="https://sandbox.sslcommerz.com/gwprocess/v3/api.php"
SSL_VALIDATION_API="https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"

*/
