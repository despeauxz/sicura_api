import express from "express";
import passport from "passport";
import { newUserCheck } from "../../../controllers/social.controller";

const router = express.Router();

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    newUserCheck
);
export default router;
