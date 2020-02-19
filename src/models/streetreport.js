module.exports = (sequelize, DataTypes) => {
    const StreetReport = sequelize.define(
        "StreetReport",
        {
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            areaId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    models: "AreaReports",
                    key: "id"
                }
            },
            report: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            geolocation: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {}
    );

    StreetReport.associate = models => {
        const { AreaReport } = models;

        StreetReport.belongsTo(AreaReport, {
            foreignKey: "areaId"
        });
    };

    return StreetReport;
};
