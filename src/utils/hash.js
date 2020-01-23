/* eslint-disable arrow-parens */
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const salt = process.env.SALT || 5;

const SALT_ROUNDS = parseInt(salt, 10);

const hash = async password => {
    const hashedPassword = await bcrypt.hashSync(password, SALT_ROUNDS);

    return hashedPassword;
};

export default hash;
