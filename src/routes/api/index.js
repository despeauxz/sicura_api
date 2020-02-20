import express from "express";
import auth from "./auth.route";
// import social from "./social";
import state from "./state.route";
import Analysis from "./analysis";
import lga from "./lga.route";
import area from "./area.route";
import street from "./street.route";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import IncidenceValidation from "../../validations/incidence.validation";
import IncidenceController from "../../controllers/incident.controller";
import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const validation = [
    ValidationHandler.validate,
    trim,
    ValidationHandler.isEmptyReq
];

const apiRouter = express.Router();

apiRouter.get("/", (request, response) =>
    response.status(200).send("Welcome to the Sicura API")
);
apiRouter.get("/analysis", Analysis.details);
apiRouter.post(
    "/incidences",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    IncidenceValidation.create,
    validation,
    IncidenceController.create
);
apiRouter.patch(
    "/incidences/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    IncidenceValidation.update,
    validation,
    IncidenceController.update
);
apiRouter.get(
    "/incidences",
    Authorization.authorize,
    IncidenceController.getIncidences
);
apiRouter.delete(
    "/incidences/:id",
    Authorization.authorize,
    Authorization.authorizeAdmin,
    IncidenceController.remove
);

apiRouter.use("/auth", auth);
apiRouter.use("/", state);
// apiRouter.use("/", social);
apiRouter.use("/", lga);
apiRouter.use("/", area);
apiRouter.use("/", street);

export default apiRouter;
