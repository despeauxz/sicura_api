module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("StateReports", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        capital: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        report: {
            type: Sequelize.TEXT,
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
    down: queryInterface => queryInterface.dropTable("StateReports")
};
