export {};

declare module 'express-session' {
    export interface SessionData {
        passport: { [key: string]: any };
    }
}

declare global {
    namespace Express {
        export interface Request {
            User: any;
            token: string;
        }
    }
}
