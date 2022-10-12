import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import { validateSchema, schemas } from '../middlewares/validationSchema.middleware';
import { verifyTokenAdmin, verifyToken } from '../middlewares/verifyToken.middleware';
import { authLogin } from '../middlewares/auth.middlewares';
import { loginAccountLimiter } from '../middlewares/limiter.middleware';

const route: Router = Router();
const auth = new Auth();

route.post('/register', authLogin, verifyTokenAdmin, validateSchema(schemas.Auth.register), auth.register);
route.post('/login', loginAccountLimiter, validateSchema(schemas.Auth.login), auth.login);
route.delete('/logout', authLogin, verifyToken, auth.logout);

export default route;
