module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable("Users", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false
        },
        username: {
            type: Sequelize.CITEXT,
            unique: true,
            allowNull: false
        },
        email: {
            type: Sequelize.CITEXT,
            unique: true,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        gender: {
            type: Sequelize.ENUM("Male", "Female"),
            allowNull: true
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        password: {
            type: Sequelize.STRING,
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
    down: queryInterface => queryInterface.dropTable("Users")
};
