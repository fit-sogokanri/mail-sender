import Mailer from "nodemailer/lib/mailer";

export class MailAddress {
    private readonly address: string;
    private readonly name: string = "";

    constructor(address: string);
    constructor(address: string, name: string);
    constructor(arg0: string, arg1?: string) {
        this.address = arg0;
        if(arg1) this.name = arg1;
    }

    public get_address(): string {
        return this.address;
    }

    public get_name(): string {
        return this.name;
    }

    public get_formatted_name(): string {
        return `${this.name} <${this.address}>`;
    }

    public get_address_object(): Mailer.Address {
        return {
            name: this.name,
            address: this.address
        }
    }
}
