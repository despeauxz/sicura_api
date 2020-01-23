import express from "express";
import debug from "debug";
import "babel-polyfill";
import passport from "passport";
import session from "express-session";
import logger from "morgan";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import apis from "./routes/api";
import errorHandler from "./middlewares/errorHandler.middleware";

// import { facebookStrategy, googleStrategy } from "./config/passport";

const debugged = debug("app");
config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// app.use(passport.initialize());
// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//     done(null, obj);
// });

// passport.use("facebook", facebookStrategy);
// passport.use("google", googleStrategy);

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true
    })
);

app.use("/api", apis);

app.use((request, response, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use(errorHandler);

app.listen(port, () => {
    debugged(`Listening from port ${port}`);
});

export default app;
