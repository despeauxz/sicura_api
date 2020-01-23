import { v4 } from "uuid";
import hash from "../utils/hash";

module.exports = {
    up: queryInterface => queryInterface.bulkInsert("Users", [
        {
            id: v4(),
            username: "Malikberry",
            email: "despeauxz@gmail.com",
            active: true,
            firstname: "Godwin",
            lastname: "Malik",
            avatar: null,
            gender: "Male",
            admin: true,
            password: hash("password"),
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: v4(),
            username: "Chinedu",
            email: "chinedu.okeke@viisaus.com",
            active: true,
            firstname: "Chinedu",
            lastname: "Okeke",
            avatar: null,
            gender: "Male",
            admin: true,
            password: hash("password@@1"),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]),
    down: queryInterface => queryInterface.bulkDelete("Users", null, {})
};
