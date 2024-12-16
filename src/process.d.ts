declare namespace NodeJS {
    interface ProcessEnv {
        readonly PORT: string;
        readonly PEPPER: string;
        readonly DB_HOST: string;
        readonly DB_PORT: string;
        readonly DB_DATABASE: string;
        readonly DB_USERNAME: string;
        readonly DB_PASSWORD: string;
        readonly DEBUG: string;
        readonly SMTP_HOST: string;
        readonly SMTP_PORT: string;
        readonly SMTP_SECURE: string;
        readonly SMTP_USERNAME: string;
        readonly SMTP_PASSWORD: string;
    }
}







