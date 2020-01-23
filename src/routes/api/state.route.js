import express from "express";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import StateReportController from "../../controllers/stateReports.controller";
import stateValidation from "../../validations/state.validation";
import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const router = express.Router();
const validation = [
    ValidationHandler.validate,
    trim,
    ValidationHandler.isEmptyReq
];

router.post(
    "/state_reports",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    stateValidation.create,
    validation,
    StateReportController.addState
);

router.patch(
    "/state_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    stateValidation.update,
    validation,
    StateReportController.updateStateReport
);

router.get("/state_reports", StateReportController.statesReport);
router.get("/aggregate", StateReportController.aggregate);

router.get("/state_lga/:id", StateReportController.stateLGA);

router.get("/state_reports/:id", StateReportController.stateReport);
router.delete(
    "/state_reports/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    StateReportController.remove
);

export default router;
