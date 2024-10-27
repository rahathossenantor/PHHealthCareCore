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
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
};

export default config;
