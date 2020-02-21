module.exports = (sequelize, DataTypes) => {
    const LgaReport = sequelize.define(
        "LgaReport",
        {
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 100
            },
            stateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    models: "StateReports",
                    key: "id"
                }
            },
            geolocation: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {}
    );

    LgaReport.associate = models => {
        const { StateReport, AreaReport } = models;

        LgaReport.belongsTo(StateReport, {
            foreignKey: "stateId"
        });

        LgaReport.hasMany(AreaReport, {
            foreignKey: "lgaId",
            as: "areas"
        });
    };

    return LgaReport;
};
