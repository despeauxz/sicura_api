import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

/**
 * @exports
 * @class Authorization
 */
class Authenticate {
    /**
     * @method getToken
     * @memberof Authorization
     * @param {object} req
     * @returns {string} token
     */
    static getToken(req) {
        const bearerToken = req.headers.authorization;
        const token = bearerToken && bearerToken.replace("Bearer ", "");

        return token;
    }

    /**
     * @method generateToken
     * @memberof Authorization
     * @param {object} payload
     * @returns {string} token
     * expires in 24 hours
     */
    static generateToken(payload) {
        const token = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });

        return token;
    }
}

export default Authenticate;
