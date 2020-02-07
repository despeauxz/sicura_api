module.exports = {
    up: queryInterface => queryInterface.bulkInsert("Users", [
        {
            id: "83261d2d-5650-4bd5-93d5-7c65368effa2",
            username: "Malikberry",
            email: "despeauxz@gmail.com",
            active: true,
            firstname: "Godwin",
            lastname: "Malik",
            avatar: null,
            gender: "Male",
            admin: true,
            password: "$2b$05$qqK.Q7/oePIW4SSllzuL4.smoVzGbECLMd5iep1fT6ncPyhCJMINC",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "ca3c2bb1-7d64-4740-8592-9b138b8cfe36",
            username: "Chinedu",
            email: "chinedu.okeke@viisaus.com",
            active: true,
            firstname: "Chinedu",
            lastname: "Okeke",
            avatar: null,
            gender: "Male",
            admin: true,
            password: "$2b$05$qqK.Q7/oePIW4SSllzuL4.smoVzGbECLMd5iep1fT6ncPyhCJMINC",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]),
    down: queryInterface => queryInterface.bulkDelete("Users", null, {})
};
