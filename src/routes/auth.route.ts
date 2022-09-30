import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import { validateSchema, schemas } from '../middlewares/validationSchema.middleware';
import { verifyTokenAdmin } from '../middlewares/verifyToken.middleware';
import { authLogin } from '../middlewares/auth.middlewares';

const route: Router = Router();
const auth = new Auth();

route.post('/register', authLogin, verifyTokenAdmin, validateSchema(schemas.Auth.register), auth.register);
route.post('/login', validateSchema(schemas.Auth.login), auth.login);
route.delete('/logout', authLogin, auth.logout);

export default route;
