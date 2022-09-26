import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import { validateSchema, schemas } from '../middlewares/validationSchema.middleware';
import { verifyTokenAdmin } from '../middlewares/verifyToken.middleware';

const route: Router = Router();
const auth = new Auth();

route.post('/register', verifyTokenAdmin, validateSchema(schemas.Auth.register), auth.register);
route.post('/login', validateSchema(schemas.Auth.login), auth.login);
route.delete('/logout', auth.logout);

export default route;
