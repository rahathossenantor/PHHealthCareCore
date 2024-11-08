import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,

    database_url: process.env.DATABASE_URL,
    default_pass: process.env.DEFAULT_PASSWORD,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_reset_pass_access_secret: process.env.JWT_RESET_PASS_ACCESS_SECRET,

    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_reset_pass_access_expires_in: process.env.JWT_RESET_PASS_ACCESS_EXPIRES_IN,

    reset_password_url: process.env.RESET_PASSWORD_URL,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,

    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

    ssl_store_id: process.env.SSL_STORE_ID,
    ssl_store_pass: process.env.SSL_STORE_PASS,
    ssl_payment_api: process.env.SSL_PAYMENT_API,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
    ssl_success_url: process.env.SSL_SUCCESS_URL,
    ssl_fail_url: process.env.SSL_FAIL_URL,
    ssl_cancel_url: process.env.SSL_CANCEL_URL
};

export default config;
