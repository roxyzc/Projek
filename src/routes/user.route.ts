import { Router } from 'express';
import User from '../controllers/user.controller';
import Token from '../controllers/refreshToken.controller';
import { verifyToken, verifyTokenAndAuthorization, checkExpired } from '../middlewares/verifyToken.middleware';

const route: Router = Router();
const user = new User();
const token = new Token();

route.get('/check', verifyToken, user.check);
route.get('/refreshToken', checkExpired, token.refreshToken);
route.delete('/delete/:id', verifyTokenAndAuthorization, user.deleteUser);

export default route;
