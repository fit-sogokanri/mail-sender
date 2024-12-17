import Mailer from "nodemailer/lib/mailer";
import {MailAddress} from "../models/MailAddress";
import {ContentType, Priority} from "../models/Mail";

const uid = (uid_str: string): boolean =>{
    const regex = new RegExp("^[a-z][0-9a-z_\-]{4,63}$", "g")
    return regex.test(uid_str);
}

const name = (name_str: string): boolean =>{
    const length = [...name_str].length
    return length<256;
}

const mail_address = (address_str: string): boolean =>{
    const regex = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
    return regex.test(address_str);
}


const password = (password_str: string): boolean =>{
    const regex = new RegExp("^[0-9A-Za-z\-\_\/\*\+\.\,\!\#\$\%\&\(\)\~\|]{8,}$", "g")
    return regex.test(password_str);
}

const active = (active_str: string): boolean =>{
    const regex = new RegExp("^(true|false|0|1)$", "g")
    return regex.test(active_str);
}

const idm = (idm_string: string): boolean =>{
    const regex = new RegExp("^[a-zA-Z0-9]{16}$", "g")
    return regex.test(idm_string);
}

const text = (text_string: string): boolean =>{
    const regex = new RegExp(".{1,}", "g")
    return regex.test(text_string);
}

const description = (note_string: string): boolean =>{
    const regex = new RegExp(".{0,256}", "g")
    return regex.test(note_string);
}

const expires = (expires_number_or_string: number|string): boolean =>{
    //const regex = new RegExp(".{0,1024}", "g")
    //return regex.test(expires_number);
    if(typeof expires_number_or_string === "string"){
        try{
            parseInt(expires_number_or_string);
        }catch (e){
            return false;
        }
    }

    return true;
}

const uuid = (uuid_string: string): boolean=>{
    return true;
}

const mail_address_object = (address_object: unknown): address_object is Mailer.Address =>{
    if (typeof address_object !== "object" || address_object === null) {
        return false;
    }
    const { name, address } = address_object as Record<keyof Mailer.Address, unknown>;

    if (typeof name !== "string") return false;
    if (typeof address !== "string" || !mail_address(address)) return false;

    return true;
}

const input_mail_address = (address: any): boolean=>{
    if(typeof address === 'string' && mail_address(address)) return true;
    if(typeof address === 'object' && mail_address_object(address)) return true;

    return false;
}

const input_mail_address_array = (address_array: any): boolean=>{
    if(Array.isArray(address_array)){
        return address_array.some((address: any) => input_mail_address(address));
    }
    return false;
}

const attachment_object = (attachment: any): boolean => {
    if (typeof attachment !== "object" || attachment === null) {
        return false;
    }
    const {name, content} = attachment as Record<keyof { name: string, content: string }, unknown>;

    if (typeof name !== "string") return false;
    if (typeof content !== "string") return false;

    return true;
}

const attachment_array = (attachment_array: any): boolean=>{
    if(Array.isArray(attachment_array)){
        return attachment_array.some((attachment: any) => attachment_object(attachment));
    }
    return false;
}

const content_type = (content_type_string: string): boolean=>{
    return  content_type_string === ContentType.HTML || content_type_string === ContentType.TEXT;
}

const priority = (priority_string: string): boolean=>{
    return  priority_string === Priority.HIGH || priority_string === Priority.NORMAL || priority_string === Priority.LOW;
}

export const Mail = {
    mail_address: mail_address,
    mail_address_object: mail_address_object,
    from: input_mail_address,
    to: input_mail_address_array,
    cc: input_mail_address_array,
    bcc: input_mail_address_array,
    reply_to: mail_address,
    subject: text,
    content: text,
    content_type: content_type,
    attachment: attachment_object,
    attachments: attachment_array,
    priority: priority,

}

export const Tokens = {
    uuid: uuid,
    name: name,
    description: description,
    expires: expires
}