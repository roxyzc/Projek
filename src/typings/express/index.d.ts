export {};

declare global {
    namespace Express {
        export interface Request {
            user: string | any;
        }
    }
    namespace NodeJs {
        interface ProcessEnv {
            PORT: number;
            SALT: number;
            NODE_ENV: string;
            MONGODB_URL: string;
            ORIGIN: string;
            USERNAME_ADMIN: string;
            PASSWORD_ADMIN: string;
            SECRET: string;
        }
    }
}
