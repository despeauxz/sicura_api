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
                allowNull: false,
                unique: true
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
                allowNull: false
            }
        },
        {}
    );

    AreaReport.associate = models => {
        const { LgaReport } = models;

        AreaReport.belongsTo(LgaReport, {
            foreignKey: "lgaId"
        });
    };

    return AreaReport;
};
