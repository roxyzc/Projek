import { Router } from 'express';
import { register } from '../controllers/user.controller';

const route: Router = Router();

route.post('/register', register);

export default route;
