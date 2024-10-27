import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (email: string, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === "production",
        auth: {
            user: config.smtp_user,
            pass: config.smtp_pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: "md.rahathossenantor@gmail.com",
        to: email,
        subject: "Password reset link",
        text: "",
        html: `<p>Did you forget your password? Don't worry! Here is your reset link: <a href='${resetLink}' target='_blank'>
      <button>Reset Password</button>
    </a></p>`
    });
};

export default sendEmail;
