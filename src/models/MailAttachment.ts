import Mailer from "nodemailer/lib/mailer";

export class MailAttachment{
    private readonly name: string;
    private readonly content: string;
    private readonly encode: string = "base64";

    constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
    }

    public get_object(): Mailer.Attachment {
        return {
            filename: this.name,
            content: this.content,
            encoding: this.encode
        }
    }
}