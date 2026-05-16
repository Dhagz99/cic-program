import { Router} from 'express';


import loginRoutes from "../modules/login/login.routes"
import dbfRoutes from "../modules/imports/dbf/dbf.routes";
import cicUploadRoute from "../modules/cic/routes/upload.route";
import generalRoute from "../modules/general/general.route"
import stagingRoute from "../modules/cic/routes/staging.route";
import batchRoute from "../modules/cic/routes/batch.route";
import domainRoute from "../modules/cic/routes/domain.route";


const router = Router();

router.use("/general", generalRoute)


router.use("/auth", loginRoutes);
router.use("/dbf", dbfRoutes);
router.use( "/cic", cicUploadRoute);
router.use("/staging", stagingRoute);
router.use("/batch", batchRoute);
router.use("/domain", domainRoute);


export default router;