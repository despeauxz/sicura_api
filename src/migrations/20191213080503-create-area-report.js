module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("AreaReports", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        lgaId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "LgaReports",
                key: "id"
            }
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
    down: queryInterface => queryInterface.dropTable("AreaReports")
};
