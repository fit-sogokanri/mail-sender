import { createTransport } from 'nodemailer';
import { config } from "dotenv-safe";
import Mailer from "nodemailer/lib/mailer";
import {Mail} from "../models/Mail";
import {SendMailError} from "../models/errors/SendMailError";
import {MailResponse} from "../models/MailResponse";
config();

export class MailManager {
    private static transporter: Mailer = createTransport({
        pool: true,
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECUR==="true",
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    public static async send(mail: Mail): Promise<MailResponse> {
        return new Promise<MailResponse>((resolve, reject) => {
            this.transporter.sendMail(mail.get_message_object(), (err, info) => {
                if(err) reject(new SendMailError(err.message));
                resolve(MailResponse.parse(info));
            });
        })
    }
}