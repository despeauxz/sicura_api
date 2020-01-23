import jwt from "jsonwebtoken";
import { config } from "dotenv";
import Authenticate from "./authenticate.middleware";
import response from "../helpers/response.helper";
import models from "../models";

const { User, DroppedToken } = models;
config();

class Authorization {
    static async authorize(req, res, next) {
        try {
            const token = await Authenticate.getToken(req);
            if (token) {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const user = await User.findOne({ where: { id: decoded.id } });

                if (user) {
                    const droppedToken = await DroppedToken.findOne({
                        where: {
                            token
                        }
                    });
                    if (!droppedToken) {
                        req.user = user.dataValues;
                        req.decoded = decoded;
                    } else {
                        const error = new Error("Invalid Token");
                        error.name = "DroppedToken";
                        throw error;
                    }
                }
            }
            next();
        } catch (error) {
            if (error.name === "JsonWebTokenError"
              || error.name === "DroppedToken") return response.errorResponse(res, 401, "Invalid Token Provided");
            if (error.name === "TokenExpiredError") return response.errorResponse(res, 401, "Token Expired");
            next(error);
        }
    }

    static async authorizeAdmin(req, res, next) {
        const userId = req.user.id;

        User.findOne({
            where: { id: userId, admin: true }
        })
            .then(async user => {
                if (!user) {
                    await response.errorResponse(
                        res,
                        403,
                        "Unauthorized access, Admin only!"
                    );
                }
                next();
            })
            .catch(error => response.errorResponse(res, 500, error));
    }
}

export default Authorization;
