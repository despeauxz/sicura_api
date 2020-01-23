import express from "express";
import passport from "passport";
import { newUserCheck } from "../../../controllers/social.controller";

const router = express.Router();

router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { session: false }),
    newUserCheck
);
export default router;
