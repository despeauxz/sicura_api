import { check } from "express-validator";
import notEmpty from "../helpers/notEmpty.helper";
import models from "../models";

export default {
    create: [
        check("name")
            .trim()
            .exists()
            .withMessage("Name must be specific")
            .custom(value => notEmpty(value, "Name cannot be left blank"))
            .custom(value => models.LgaReport.findOne({ where: { name: value } }).then(state => {
                if (state !== null) {
                    throw new Error("This LGA report has already been created");
                }
            })),
        check("stateId")
            .trim()
            .exists()
            .withMessage("State ID must be specified")
            .custom(value => models.StateReport.findOne({ where: { id: value } }).then(lga => {
                if (lga === null) {
                    throw new Error("State does not exists");
                }
            })),
        check("report")
            .trim()
            .exists()
            .withMessage("Report field is required")
            .custom(value => notEmpty(value, "Report cannot be left blank")),
        check("rating")
            .trim()
            .exists()
            .withMessage("Rating field is required")
            .custom(value => notEmpty(value, "Rating cannot be left blank")),
    ],
    update: [
        check("name")
            .trim()
            .exists()
            .withMessage("Name must be specific")
            .optional(),
        check("report")
            .trim()
            .exists()
            .optional()
            .withMessage("Report field is required")
            .custom(value => notEmpty(value, "Report cannot be left blank")),
    ]
};
