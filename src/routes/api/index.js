import express from "express";
import auth from "./auth.route";
// import social from "./social";
import state from "./state.route";
import lga from "./lga.route";
import area from "./area.route";
import street from "./street.route";

const apiRouter = express.Router();

apiRouter.get("/", (request, response) => response.status(200).send("Welcome to the Sicura API"));

apiRouter.use("/auth", auth);
apiRouter.use("/", state);
// apiRouter.use("/", social);
apiRouter.use("/", lga);
apiRouter.use("/", area);
apiRouter.use("/", street);

export default apiRouter;
