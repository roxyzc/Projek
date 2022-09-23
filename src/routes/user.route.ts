import { Router } from 'express';
import User from '../controllers/user.controller';
import { validateSchema, schemas } from '../middlewares/validationSchema.middleware';

const route: Router = Router();
const user = new User();

route.post('/register', validateSchema(schemas.Auth.register), user.register);

export default route;
