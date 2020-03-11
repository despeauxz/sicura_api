/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
import express from "express";
import multer from "multer";
import CSVToJson from "csvtojson";
import auth from "./auth.route";
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
import models from "../../models";

const {
    StateReport,
    LgaReport,
    AreaReport,
    StreetReport,
    IncidentTypes
} = models;

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
apiRouter.use("/", lga);
apiRouter.use("/", area);
apiRouter.use("/", street);

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "src/uploads");
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage }).single("file");

// apiRouter.post("/reset", (req, res) => {
//     StateReport.truncate();
// });

apiRouter.post("/bulk-upload", (req, res) => {
    StreetReport.truncate({ cascade: true });
    AreaReport.truncate({ cascade: true });
    LgaReport.truncate({ cascade: true });
    StateReport.truncate({ cascade: true });

    upload(req, res, err => {
        if (err) {
            console.error(err);
        }

        CSVToJson({
            delimiter: ["|"]
        })
            .fromFile(req.file.path)
            .then(data => {
                const stateData = data.map((item, index) => {
                    if (item.state_name) {
                        return {
                            id: index + 1,
                            name: item.state_name,
                            capital: item.state_capital,
                            type: "state",
                            report: JSON.stringify({
                                murder: 0,
                                kidnap: 0,
                                armed_robbery: 0
                            })
                        };
                    }
                });

                const lgaData = data.map((item, index) => {
                    if (item.lga_name) {
                        return {
                            id: index + 1,
                            name: item.lga_name,
                            stateId: item.state_id,
                            type: "lga",
                            report: JSON.stringify({
                                murder: 0,
                                kidnap: 0,
                                armed_robbery: 0
                            })
                        };
                    }
                });

                const areaData = data.map(async (item, index) => {
                    if (item.area_name) {
                        return {
                            id: index + 1,
                            name: item.area_name,
                            lgaId: 1,
                            type: "area",
                            report: JSON.stringify({
                                murder: 0,
                                kidnap: 0,
                                armed_robbery: 0
                            })
                        };
                    }
                });

                const streetData = data.map((item, index) => {
                    if (item.street_name) {
                        const report = {
                            murder: item.murder,
                            kidnap: item.kidnap,
                            armed_robbery: item.armed_robbery
                        };
                        return {
                            id: index + 1,
                            name: item.street_name,
                            areaId: 1,
                            type: "street",
                            report: JSON.stringify(report)
                        };
                    }
                });
                console.log(areaData);
                StateReport.bulkCreate(stateData, {
                    updateOnDuplicate: ["name"],
                    individualHooks: true
                })
                    .then(() => {
                        LgaReport.bulkCreate(lgaData, {
                            updateOnDuplicate: ["name"],
                            individualHooks: true
                        });
                    })
                    .then(() => {
                        AreaReport.bulkCreate(areaData, {
                            updateOnDuplicate: ["name"],
                            individualHooks: true
                        });
                    })
                    .then(() => {
                        StreetReport.bulkCreate(streetData, {
                            updateOnDuplicate: ["name"],
                            individualHooks: true
                        });
                    })
                    .catch(error => {
                        if (error) {
                            return res.json({
                                status: 400,
                                error: "Error Parsing CSV or duplicate data"
                            });
                        }
                    });
            });

        return res.status(200).json({
            message: "Okay"
        });
    });
});

export default apiRouter;
