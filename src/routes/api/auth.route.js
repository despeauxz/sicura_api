import express from "express";
import ValidationHandler from "../../middlewares/validationHandler.middleware";
import UserController from "../../controllers/user.controller";
import authValidation from "../../validations/auth.validation";
// import Authorization from "../../middlewares/authorization.middleware";
import trim from "../../middlewares/trim.middleware";

const router = express.Router();
const validation = [ValidationHandler.validate, trim, ValidationHandler.isEmptyReq];


router.post("/register", authValidation.register, validation, UserController.register);
router.post("/login", authValidation.login, validation, UserController.login);
router.post("/activate_user", UserController.verifyAccount);
router.post("/verify_account", UserController.sendMailToVerifyAccount);

// router.post("/logout", UserController.logout);
router.post("/forgot_password", authValidation.forgotPassword, validation, UserController.forgotPassword);
router.post("/reset_password", authValidation.resetPassword, validation, UserController.resetPassword);

export default router;
