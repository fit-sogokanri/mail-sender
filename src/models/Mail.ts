import {MailAddress} from "./MailAddress";
import {MailAttachment} from "./MailAttachment";
import Mailer from "nodemailer/lib/mailer";

export class Mail {
    private from: MailAddress;
    private to: MailAddress[];
    private cc: MailAddress[];
    private bcc: MailAddress[];

    private subject: string;
    private html: string;
    private attachments: MailAttachment[];

    constructor(
        from: MailAddress,
        to: MailAddress[],
        subject: string,
        html: string,
        cc?: MailAddress[],
        bcc?: MailAddress[],
        attachments?: []
    ) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.html = html;
        this.cc = cc?.length?cc:[];
        this.bcc = bcc?.length?bcc:[];
        this.attachments = attachments?.length?attachments:[];
    }

    public get_message_object(): Mailer.Options{
        return {
            from: this.from.get_address_object(),
            to: this.to.map(to_v=>{return to_v.get_address_object()}),
            subject: this.subject,
            html: this.html,

            cc: this.cc.map(cc_v=>{return cc_v.get_address_object()}),
            bcc: this.bcc.map(bcc_v=>{return bcc_v.get_address_object()}),
            attachments: this.attachments.map((attachment: MailAttachment) => {return attachment.get_object()}),
        }
    }

}