import { Router } from 'express';
import Siswa from '../controllers/siswa.controller';
import { verifyToken, verifyTokenAdmin } from '../middlewares/verifyToken.middleware';
// import { authLogin } from '../middlewares/auth.middlewares';
import { schemas, validateSchema } from '../middlewares/validationSchema.middleware';

const route: Router = Router();
const siswa = new Siswa();

route.get('/find', verifyToken, siswa.findSiswa);
route.get('/findallsiswa', verifyTokenAdmin, siswa.findAllSiswa);
route.post('/violation', verifyTokenAdmin, validateSchema(schemas.User.violation), siswa.createViolationSiswa);
route.delete('/deletesiswa/:id', verifyToken, siswa.deleteSiswa);
route.get('/stat', verifyToken, siswa.findStat);
route.get('/ranksiswa', verifyToken, siswa.findRank);
// route.get('/filterAlphabet', authLogin, verifyToken, siswa.filterUserAlfabet);

export default route;
