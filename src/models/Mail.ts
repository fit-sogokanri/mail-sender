import Mailer from "nodemailer/lib/mailer";
import {MailAddress} from "./MailAddress";
import {MailAttachment} from "./MailAttachment";
import {FormatError} from "./errors/FormatError";

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

    public static parse(target: any): Mail {
        if (typeof target !== "object") throw new Error("オブジェクトではない");
        if (Array.isArray(target)) throw new Error("配列はいらない");

        const target_from = target["from"];
        const target_to = target["to"];
        const target_cc = target["cc"];
        const target_bcc = target["bcc"];
        const target_reply_to = target["replyTo"];
        const target_subject = target["subject"];
        const target_content = target["content"];
        const target_content_type = target["contentType"];
        const target_attachments = target["attachments"];
        const target_priority = target["priority"];

        console.log(target_to);
        if (!Array.isArray(target_to)) throw new FormatError("This value type must be Array.", ["to"])
        if (target_cc && !Array.isArray(target_cc)) throw new FormatError("This value type must be Array.", ["cc"])
        if (target_bcc && !Array.isArray(target_bcc)) throw new FormatError("This value type must be Array.", ["bcc"])
        if (target_attachments && !Array.isArray(target_attachments)) throw new FormatError("This value type must be Array.", ["attachments"])

        const from: MailAddress = MailAddress.parse(target_from);
        const to: MailAddress[] = target_to.map((v: any) => {
            return MailAddress.parse(v)
        });
        const cc: MailAddress[] | undefined = target_cc?.map((v: any) => {
            return MailAddress.parse(v)
        });
        const bcc: MailAddress[] | undefined = target_bcc?.map((v: any) => {
            return MailAddress.parse(v)
        });
        const reply_to: MailAddress | undefined = target_reply_to ? MailAddress.parse(target_from) : undefined;

        const subject: string = target_subject;
        const content: string = target_content;
        const content_type: ContentType = ((): ContentType => {
            switch (target_content_type.toLowerCase()) {
                case ContentType.HTML:
                    return ContentType.HTML;
                case ContentType.TEXT:
                    return ContentType.TEXT;
                default:
                    throw new FormatError("This value expected \"html\" or \"text\".", ["contentType"])
            }
        })();

        const attachments: MailAttachment[] | undefined = target_attachments?.map((v: any) => {return MailAttachment.parse(v)});

        const priority: Priority | undefined = !target_priority ? undefined : ((): Priority => {
            switch (target_priority.toLowerCase()) {
                case Priority.HIGH:
                    return Priority.HIGH;
                case Priority.NORMAL:
                    return Priority.NORMAL;
                case Priority.LOW:
                    return Priority.LOW;
                default:
                    throw new FormatError("This value expected \"high\", \"normal\" or \"low\".", ["priority"])
            }
        })();

        return new Mail(
            from,
            to,
            subject,
            content,
            content_type,
            cc,
            bcc,
            reply_to,
            attachments,
            priority
        )
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
