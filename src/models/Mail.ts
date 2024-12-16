import {MailAddress} from "./MailAddress";
import {MailAttachment} from "./MailAttachment";
import Mailer from "nodemailer/lib/mailer";

export const ContentType = {
    TEXT: "text",
    HTML: "html",
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const Priority = {
    HIGH: "high",
    NORMAL: "normal",
    LOW: "low",
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export class Mail {
    private from: MailAddress;
    private to: MailAddress[];
    private cc: MailAddress[];
    private bcc: MailAddress[];
    private reply_to: MailAddress|undefined;
    private subject: string;
    private content: string;
    private content_type: ContentType;
    private attachments: MailAttachment[];
    private priority: Priority|undefined;

    constructor(
        from: MailAddress,
        to: MailAddress[],
        subject: string,
        content: string,
        content_type: ContentType,
        cc?: MailAddress[],
        bcc?: MailAddress[],
        reply_to?: MailAddress,
        attachments?: MailAttachment[],
        priority?: Priority,
    ) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.content = content;
        this.content_type = content_type;
        this.cc = cc?.length?cc:[];
        this.bcc = bcc?.length?bcc:[];
        this.reply_to = reply_to;
        this.attachments = attachments?.length?attachments:[];
        this.priority = priority;
    }

    public get_message_object(): Mailer.Options {
        const body: Mailer.Options = {
            from: this.from.get_address_object(),
            to: this.to.map(to_v => {
                return to_v.get_address_object()
            }),
            subject: this.subject,
            cc: this.cc.map(cc_v => {
                return cc_v.get_address_object()
            }),
            bcc: this.bcc.map(bcc_v => {
                return bcc_v.get_address_object()
            }),
            attachments: this.attachments.map((attachment: MailAttachment) => {
                return attachment.get_object()
            }),
        }

        body[this.content_type] = this.content;

        if(this.reply_to) body["replyTo"] = this.reply_to.get_address();
        if(this.priority) body["priority"] = this.priority;

        return body
    }
}
