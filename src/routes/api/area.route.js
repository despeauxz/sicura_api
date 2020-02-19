import express from "express";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import AreaReportController from "../../controllers/area.controller";
import AreaValidation from "../../validations/area.validation";
import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const router = express.Router();
const validation = [
    ValidationHandler.validate,
    trim,
    ValidationHandler.isEmptyReq
];

router.post(
    "/area_reports",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    AreaValidation.create,
    validation,
    AreaReportController.create
);

router.patch(
    "/area_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    AreaValidation.update,
    validation,
    AreaReportController.update
);

router.get("/area_reports", AreaReportController.reports);
router.get("/area_street/:id", AreaReportController.AreaStreet);
router.get("/area_reports/:id", AreaReportController.report);
router.delete(
    "/area_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    AreaReportController.remove
);

export default router;
