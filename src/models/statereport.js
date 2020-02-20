module.exports = (sequelize, DataTypes) => {
    const StateReport = sequelize.define("StateReport", {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capital: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geolocation: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {});

    StateReport.associate = models => {
        const { LgaReport } = models;

        StateReport.hasMany(LgaReport, {
            foreignKey: "stateId",
            as: "lgas"
        });
    };

    return StateReport;
};
