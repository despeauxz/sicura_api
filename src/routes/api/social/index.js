import express from "express";
import facebook from "./facebook.route";
import google from "./google.route";

const router = express.Router();

router.use("/", facebook);
router.use("/", google);

export default router;
