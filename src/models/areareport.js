import axios from "axios";

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
                allowNull: true,
                defaultValue: 100
            }
        },
        {
            hooks: {
                beforeCreate: async area => {
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${area.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await area.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                },
                beforeUpdate: async area => {
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${area.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await area.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                }
            }
        }
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
