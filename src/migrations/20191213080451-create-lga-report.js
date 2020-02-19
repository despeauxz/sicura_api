module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("LgaReports", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        stateId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "StateReports",
                key: "id"
            }
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        geolocation: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }),
    down: queryInterface => queryInterface.dropTable("LgaReports")
};
