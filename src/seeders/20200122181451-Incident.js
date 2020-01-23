module.exports = {
    up: queryInterface => queryInterface.bulkInsert("IncidentTypes", [
        {
            name: "Kidnap",
            weight: 0.2,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: "Armed-Robbery",
            weight: 0.3,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: "Murder",
            weight: 0.5,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]),
    down: queryInterface => queryInterface.bulkDelete("IncidentTypes", null, {})
};
