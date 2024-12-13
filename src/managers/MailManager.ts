import { createTransport } from 'nodemailer';
import Mailer from "nodemailer/lib/mailer";
import {Mail} from "../models/Mail";

export class MailManager {
    private static transporter: Mailer = createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE, // use TLS
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    public static async send(mail: Mail): Promise<void> {
        await this.transporter.sendMail(mail.get_message_object());
    }
}