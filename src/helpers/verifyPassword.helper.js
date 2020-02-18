import bcrypt from "bcrypt";

/**
 * @method verifyPassword
 * @param {string} password
 * @return {Promise} Promise of true or false
 */
const verifyPassword = (password, hash) => new Promise((resolve, reject) => {
    try {
        resolve(bcrypt.compareSync(password, hash));
    } catch (error) {
        reject(error);
    }
});

export default verifyPassword;
