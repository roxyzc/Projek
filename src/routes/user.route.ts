import { Router } from 'express';
import User from '../controllers/user.controller';
import Token from '../controllers/refreshToken.controller';
import { verifyToken, verifyTokenAndAuthorization, checkExpired } from '../middlewares/verifyToken.middleware';
import { authLogin } from '../middlewares/auth.middlewares';

const route: Router = Router();
const user = new User();
const token = new Token();

route.get('/check', authLogin, verifyToken, user.check);
route.get('/refreshToken', authLogin, checkExpired, token.refreshToken);
route.delete('/delete/:id', authLogin, verifyTokenAndAuthorization, user.deleteUser);
// route.put('/update/:id', verifyTokenAndAuthorization, user.updateUser);

export default route;
