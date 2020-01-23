import { config } from "dotenv";
import authenticate from "../middlewares/authenticate.middleware";
import generateUsername from "../helpers/auth.helper";
import models from "../models";

config();
const { User } = models;

const { FRONTEND_REDIRECT_URL } = process.env;

const socialAuth = async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails, photos } = profile;

        const [firstname, lastname] = displayName.split(" ");

        if (!emails) {
            const emailError = "No email was found in your account";
            return done(null, emailError);
        }

        const email = emails[0].value;

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                firstname,
                lastname,
                avatar: photos[0].value,
                username: generateUsername(),
                password: id,
                email,
                active: true
            }
        });

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        const token = authenticate.generateToken(payload);
        user.newUser = created;
        user.token = token;
        return done(null, user);
    } catch (error) {
        return error;
    }
};

const newUserCheck = (req, res) => {
    const { token, emailError } = req.user;

    if (emailError) {
        return res.status(401).json({
            status: res.statusCode,
            error: emailError
        });
    }

    res.redirect(`${FRONTEND_REDIRECT_URL}/signup?token=${token}`);
};

export { socialAuth, newUserCheck };
