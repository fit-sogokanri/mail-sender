
interface Envelope {
    from: string,
    to: string[],
    cc?: string[],
    bcc?: string[]
}

export class MailResponse {
    private readonly message_id: string;
    private readonly accepted: string[];
    private readonly rejected: string[];
    private readonly response: string;
    private readonly envelope: Envelope;

    constructor(message_id: string, accepted: string[], rejected: string[], response: string, envelope: Envelope) {
        this.message_id = message_id;
        this.accepted = accepted;
        this.rejected = rejected;
        this.response = response;
        this.envelope = envelope;
    }

    public static parse(target: any): MailResponse {
        const target_message_id = target["message_id"];
        const target_accepted = target["accepted"];
        const target_rejected = target["rejected"];
        const target_response = target["response"];
        const target_envelope = target["envelope"];

        return new MailResponse(target_message_id, target_accepted, target_rejected, target_response, target_envelope);
    }

    public get_object(): any {
        return {
            message_id: this.message_id,
            accepted: this.accepted,
            rejected: this.rejected,
            response: this.response,
            envelope: this.envelope
        }
    }
}
