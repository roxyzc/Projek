import { Router } from 'express';
import Siswa from '../controllers/siswa.controller';
import { verifyToken, verifyTokenAdmin } from '../middlewares/verifyToken.middleware';
import { authLogin } from '../middlewares/auth.middlewares';
import { schemas, validateSchema } from '../middlewares/validationSchema.middleware';

const route: Router = Router();
const siswa = new Siswa();

route.get('/find', authLogin, verifyToken, siswa.findSiswa);
route.get('/findallsiswa', authLogin, verifyTokenAdmin, siswa.findAllSiswa);
route.post('/violation', authLogin, verifyTokenAdmin, validateSchema(schemas.User.violation), siswa.createViolationSiswa);
route.delete('/deletesiswa/:id', authLogin, verifyToken, siswa.deleteSiswa);
route.get('/stat', authLogin, verifyToken, siswa.findStat);
route.get('/ranksiswa', authLogin, verifyToken, siswa.findRank);
// route.get('/filterAlphabet', authLogin, verifyToken, siswa.filterUserAlfabet);

export default route;
