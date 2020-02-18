/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import randomString from "random-string";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import models from "../models";
import Authenticate from "../middlewares/authenticate.middleware";
import getUserObject from "../helpers/getUserObject.helper";
import response from "../helpers/response.helper";
import verifyPassword from "../helpers/verifyPassword.helper";
import { sendVerifyMailToken, sendForgotPasswordMail, sendResetSuccessMail } from "../utils/Mailer";

const { User, VerifyToken, DroppedToken } = models;

/**
 * @exports
 * @class UserController
 */
class UserController {
    /**
     * Registers a new user
     * @method register
     * @memberof UserController
     * @param {object} req
     * @param {object} res
     * @returns {(function|object)} Function next() or JSON object
     */
    static async register(req, res) {
        const {
            firstname,
            lastname,
            username,
            email,
            password
        } = req.body;

        const user = await User.create({
            firstname,
            lastname,
            username,
            email: email.toLowerCase(),
            password
        });

        const token = Authenticate.generateToken(
            UserController.tokenObj(user)
        );
        const tokenExpiry = Date.now() + ((Number(process.env.RESET_TOKEN_EXPIRE)) || 75600000);
        const verifyToken = randomString({ length: 40 });

        const verifyDetails = {
            verifyToken, tokenExpiry, userId: user.id
        };
        await VerifyToken.create({ ...verifyDetails });
        sendVerifyMailToken(verifyToken, user.email, user.username);

        const payload = getUserObject(user);
        response.successResponse(res, 201, { token, payload });
    }

    /**
     * Logs in a user
     * @method login
     * @memberof UserController
     * @param {object} req
     * @param {object} res
     * @returns {(function|object)} Function next() or JSON object
     */
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            await User.findOne({ where: { email } }).then(async user => {
                verifyPassword(password, user.dataValues.password).then(verify => {
                    if (!verify) {
                        response.errorResponse(
                            res,
                            401,
                            "Email/Password does not match"
                        );
                    }

                    const token = Authenticate.generateToken(
                        UserController.tokenObj(user)
                    );
                    user = getUserObject(user);

                    response.successResponse(res, 200, { token, user });
                });
            });
        } catch (error) {
            return response.errorResponse(res, 400, error);
        }
    }

    /**
     * Signuout user and blacklist tokens
     *
     * @static
     * @param {*} req
     * @param {*} res
     * @returns {json} returns json object
     * @memberof UserController logout
     */
    static async logout(req, res) {
        try {
            const token = await Authenticate.getToken(req);
            await DroppedToken.create({ token });
            return response.messageResponse(res, 201, "You are now logged out");
        } catch (error) {
            return response.errorResponse(res, 401, "You are not logged in");
        }
    }

    /**
     * Update token
     * @async
     * @param {object} user
     * @return {string} Returns token string
     * @static
     */
    static async createVerifyToken(user) {
        const { id } = user;
        const verifyToken = randomString({ length: 40 });
        const tokenExpiry = Date.now() + ((Number(process.env.RESET_TOKEN_EXPIRE)) || 75600000);

        const verifyDetails = {
            verifyToken, tokenExpiry, userId: id
        };

        const userDetails = await user.getVerifiedUser({
            where: {
                userId: id
            }
        });

        await userDetails
            .update(verifyDetails);

        return verifyToken;
    }

    /**
     * Sends mail to verify a new user
     * @async
     * @param  {object} req - Request object
     * @param {object} res - Response object
     * @param {object} next The next middleware
     * @return {json} Returns json object
     * @static
     */
    static async sendMailToVerifyAccount(req, res, next) {
        try {
            const {
                active, email, username
            } = req.user;

            const { user } = req;
            if (active === false) {
                const verifyToken = await UserController.createVerifyToken(user);
                sendVerifyMailToken(verifyToken, email, username);
                response.messageResponse(res, 200, "Verification mail sent");
            }
            // redundant check was removed
            response.errorResponse(res, 400, "You are already verified");
        } catch (err) {
            next(err);
        }
    }

    /**
     * Sends password token to user
     * @method forgotPassword
     * @memberof UserController
     * @param {object} req
     * @param {object} res
     * @returns {(function|object)} Function next() or JSON object
     */
    static async forgotPassword(req, res) {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                error:
                    "This user is not registered on the platform, please signup instead"
            });
        }

        const token = randomString({ length: 40 });

        await user.update({
            passwordResetToken: token,
            passwordTokenExpiry: Date.now() + 3600000 // 1 hour from now
        });

        sendForgotPasswordMail(token, email, user.get().username);

        return res.status(200).json({
            message: "A reset token has been sent to your email address"
        });
    }

    /**
    * Verifies a new user
    * @async
    * @param  {object} req - Request object
    * @param {object} res - Response object
    * @param {object} next The next middleware
    * @return {json} Returns json object
    * @static
    */
    static async verifyAccount(req, res, next) {
        try {
            const { token, email } = req.query;

            if (!token || !email) return response.errorResponse(res, 400, "Please use a valid verification link");
            const user = await User.findOne({ where: { email } });
            if (!user) return response.errorResponse(res, 401, "Invalid Token");

            const tokenDetails = await user.getVerifiedUser({
                where: {
                    tokenExpiry: {
                        [Op.gt]: Date.now()
                    }
                }
            });

            if (!tokenDetails) return Response.error(res, 401, "Invalid Token");

            const { verifyToken } = tokenDetails.get();

            const match = await bcrypt.compare(token, verifyToken);
            if (!match) return Response.error(res, 401, "Invalid Token");

            await user.update({ active: true });
            await tokenDetails.destroy();
            return Response.success(res, 200, "You a now verified");
        } catch (err) {
            next(err);
        }
    }

    /**
   * Update token
   * @async
   * @param {object} user
   * @return {string} Returns token string
   * @static
   */
    static async updateToken(user) {
        const token = randomString({ length: 40 });
        const resetDetails = {
            resetPasswordToken: token,
            resetPasswordExpiry: Date.now() + Number(process.env.RESET_TOKEN_EXPIRE
        || 75600000) // 1 day from now
        };

        const userResetToken = await user.getResetToken();
        if (userResetToken) {
            await userResetToken.update(resetDetails);
        } else {
            await user.createResetToken(resetDetails);
        }
        return token;
    }

    /**
     * Sends password token to user
     * @method resetPassword
     * @memberof UserController
     * @param {object} req
     * @param {object} res
     * @returns {(function|object)} Function next() or JSON object
     */
    static async resetPassword(req, res) {
        const { password } = req.body;
        const { email, token } = req.query;

        const user = await User.findOne({
            where: {
                passwordResetToken: token,
                passwordTokenExpiry: {
                    [Op.gt]: Date.now()
                }
            }
        });

        if (!user) {
            return res.status(400).send({
                error: "Password reset token is invalid or has expired"
            });
        }

        await user.update({
            password,
            passwordResetToken: null,
            passwordTokenExpiry: null
        });

        sendResetSuccessMail(email, user.get().username);

        return res.status(200).json({ message: "Password reset successful" });
    }

    static async updateUserDetails(req, res) {
        const userId = req.user.id;
        const { othername, phoneNo, avatar } = req.body;

        await User.findOne({
            where: { id: userId }
        }).then(user => {
            user.update({
                othername: othername || user.othernamee,
                phoneNo: phoneNo || user.phoneNo,
                avatar: avatar || user.avatar
            }).then(updatedUser => response.successResponse(res, 200, getUserObject(updatedUser)));
        });
    }

    static async refreshToken(req, res) {
        const authUser = await models.User.findOne({
            where: { email: req.user.email }
        });
        const user = getUserObject({ ...authUser.dataValues });
        const token = Authenticate.generateToken(user);

        return res.status(200).json({ user, token });
    }

    static tokenObj(user) {
        return {
            id: user.id,
            email: user.email,
            admin: user.admin
        };
    }
}

export default UserController;
