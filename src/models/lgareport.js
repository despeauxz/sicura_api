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
                allowNull: false,
                unique: true
            },
            stateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    models: "StateReports",
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

    LgaReport.associate = models => {
        const { StateReport } = models;

        LgaReport.belongsTo(StateReport, {
            foreignKey: "stateId"
        });
    };

    return LgaReport;
};
