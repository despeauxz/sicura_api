module.exports = (sequelize, DataTypes) => {
    const StateReport = sequelize.define("StateReport", {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        capital: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        geolocation: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        report: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {});

    StateReport.associate = models => {
        const { LgaReport, AreaReport, StreetReport } = models;

        StateReport.hasMany(LgaReport, {
            foreignKey: "stateId",
            as: "lga"
        });

        StateReport.hasMany(AreaReport, {
            foreignKey: "lgaId",
            as: "areas"
        });

        StateReport.hasMany(StreetReport, {
            foreignKey: "areaId",
            as: "streets"
        });
    };

    return StateReport;
};
