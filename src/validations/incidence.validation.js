import { check } from "express-validator";
import notEmpty from "../helpers/notEmpty.helper";

export default {
    create: [
        check("name")
            .trim()
            .exists()
            .withMessage("Name must be specific")
            .custom(value => notEmpty(value, "Name cannot be left blank")),
        check("weight")
            .trim()
            .isNumeric()
            .exists()
            .withMessage("Capital must be specific")
            .custom(value => notEmpty(value, "Capital cannot be left blank"))
    ],
    update: [
        check("name")
            .trim()
            .exists()
            .optional()
            .withMessage("Name must be specific")
            .custom(value => notEmpty(value, "Name cannot be left blank")),
        check("weight")
            .trim()
            .isNumeric()
            .exists()
            .optional()
            .withMessage("Capital must be specific")
            .custom(value => notEmpty(value, "Capital cannot be left blank"))
    ]
};
