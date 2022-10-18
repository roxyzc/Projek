import { Router } from 'express';
import User from '../controllers/user.controller';
import Token from '../controllers/refreshToken.controller';
import { verifyTokenAndAuthorization, checkExpired, verifyTokenAdmin } from '../middlewares/verifyToken.middleware';
import { authLogin } from '../middlewares/auth.middlewares';
import { schemas, validateSchema } from '../middlewares/validationSchema.middleware';

const route: Router = Router();
const user = new User();
const token = new Token();

route.get('/refreshtoken', authLogin, checkExpired, token.refreshToken);
route.delete('/delete/:id', authLogin, verifyTokenAndAuthorization, user.deleteUser);
route.put('/update/:id', authLogin, verifyTokenAndAuthorization, validateSchema(schemas.User.update), user.updateUser);
route.get('/findalluser', authLogin, verifyTokenAdmin, user.findAllUser);

export default route;
