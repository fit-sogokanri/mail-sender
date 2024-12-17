import Mailer from "nodemailer/lib/mailer";
import {Mail} from "../utils/format_check";

export class MailAttachment{
    private readonly name: string;
    private readonly content: string;
    private readonly encode: string = "base64";

    constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
    }

    public static parse(target: any): MailAttachment{
        if(typeof target == "object" && Mail.attachment(target)) return new MailAttachment(target.name, target.content);
        throw new Error(`${target} is not a valid attachment`);
    }

    public get_object(): Mailer.Attachment {
        return {
            filename: this.name,
            content: this.content,
            encoding: this.encode
        }
    }
}