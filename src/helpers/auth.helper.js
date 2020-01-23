import randomstring from "randomstring";

const generateUsername = () => {
    const random = randomstring.generate({
        length: 12,
        charset: "alphabetic"
    });

    return random;
};

export default generateUsername;
