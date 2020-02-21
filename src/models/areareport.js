module.exports = (sequelize, DataTypes) => {
    const AreaReport = sequelize.define(
        "AreaReport",
        {
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lgaId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    models: "LgaReports",
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
                allowNull: true,
                defaultValue: 100
            },
        },
        {}
    );

    AreaReport.associate = models => {
        const { LgaReport, StreetReport } = models;

        AreaReport.belongsTo(LgaReport, {
            foreignKey: "lgaId"
        });

        AreaReport.hasMany(StreetReport, {
            foreignKey: "areaId",
            as: "streets"
        });
    };

    return AreaReport;
};
