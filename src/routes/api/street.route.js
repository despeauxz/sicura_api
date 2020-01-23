import express from "express";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import StreetReportController from "../../controllers/street.controller";
import StreetValidation from "../../validations/street.validation";
import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const router = express.Router();
const validation = [
    ValidationHandler.validate,
    trim,
    ValidationHandler.isEmptyReq
];

router.post(
    "/street_reports",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    StreetValidation.create,
    validation,
    StreetReportController.create
);

// router.patch(
//     "/lga_reports/:id",
//     Authorization.authorize,
//     Authorization.authorizeAdmin,
//     LGAValidation.update,
//     validation,
//     LGAReportController.updateStateReport
// );

router.get("/street_reports", StreetReportController.reports);
router.get("/street_reports/:id", StreetReportController.report);
router.delete(
    "/street_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    StreetReportController.remove
);

export default router;
