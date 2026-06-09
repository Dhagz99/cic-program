import { Router} from 'express';


import loginRoutes from "../modules/login/login.routes"
import dbfRoutes from "../modules/imports/dbf/dbf.routes";
import cicUploadRoute from "../modules/cic/routes/upload.route";
import generalRoutes from "../modules/general/general.route"
import stagingRoute from "../modules/cic/routes/staging.route";
import batchRoute from "../modules/cic/routes/batch.route";
import domainRoute from "../modules/cic/routes/domain.route";
import reportRoutes from "../modules/reports/report.route";
import clientRoutes from "../modules/clients/client.route";
import loanRoutes from "../modules/loans/loan.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";
import initializeRoutes from "../modules/initialize/initialize.route";


const router = Router();

router.use("/general", generalRoutes)


router.use("/auth", loginRoutes);
router.use("/dbf", dbfRoutes);
router.use( "/cic", cicUploadRoute);
router.use("/staging", stagingRoute);
router.use("/batch", batchRoute);
router.use("/domain", domainRoute);
router.use( "/reports", reportRoutes);
router.use( "/clients", clientRoutes);
router.use( "/loans", loanRoutes);
router.use( "/dashboard", dashboardRoutes);
router.use( "/initialize", initializeRoutes);


export default router;