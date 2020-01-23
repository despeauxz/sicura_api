import { config } from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as TwitterStrategy } from "passport-twitter";
import { socialAuth } from "../controllers/social.controller";

config();

const {
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,
    GOOGLE_APP_ID,
    GOOGLE_APP_SECRET,
    GOOGLE_CALLBACK_URL
} = process.env;

const facebookConfig = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ["id", "emails", "displayName", "photos"]
};

const googleConfig = {
    clientID: GOOGLE_APP_ID,
    clientSecret: GOOGLE_APP_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
};

const facebookStrategy = new FacebookStrategy(facebookConfig, socialAuth);

const googleStrategy = new GoogleStrategy(googleConfig, socialAuth);

export { facebookStrategy, googleStrategy };
