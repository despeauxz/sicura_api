import express from "express";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import LGAReportController from "../../controllers/lga.controller";
import LGAValidation from "../../validations/lga.validation";
import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const router = express.Router();
const validation = [
    ValidationHandler.validate,
    trim,
    ValidationHandler.isEmptyReq
];

router.post(
    "/lga_reports",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    LGAValidation.create,
    validation,
    LGAReportController.create
);

router.patch(
    "/lga_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    LGAValidation.update,
    validation,
    LGAReportController.update
);

router.get("/lga_reports", LGAReportController.reports);
router.get("/lga_area/:id", LGAReportController.LgaArea);

router.get("/lga_reports/:id", LGAReportController.report);
router.delete(
    "/lga_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    LGAReportController.remove
);

export default router;
