export {};

declare global {
    namespace Express {
        export interface Request {
            User: any;
            token: string;
        }
    }
}
