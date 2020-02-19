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
            .custom(value => models.StateReport.findOne({ where: { name: value } }).then(state => {
                if (state !== null) {
                    throw new Error("This state has already been created");
                }
            })),
        check("capital")
            .trim()
            .exists()
            .withMessage("Capital must be specific")
            .custom(value => notEmpty(value, "Capital cannot be left blank")),
    ],
    update: [
        check("name")
            .trim()
            .exists()
            .withMessage("Name must be specific")
            .optional(),
        check("capital")
            .trim()
            .exists()
            .optional()
            .withMessage("Capital must be specific")
            .custom(value => notEmpty(value, "Capital cannot be left blank")),
    ]
};
