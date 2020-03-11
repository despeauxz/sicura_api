import axios from "axios";

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
                allowNull: false,
                unique: true
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
        {
            hooks: {
                beforeCreate: async street => {
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${street.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    const incidences = await sequelize.models.IncidentTypes.findAll();
                    const data = JSON.parse(street.dataValues.report);
                    const rating =
                        100 -
                        (data.kidnap * incidences[0].weight +
                            data.armed_robbery * incidences[1].weight +
                            data.murder * incidences[2].weight);
                    await street.setDataValue("rating", rating);
                    await street.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                },
                beforeUpdate: async street => {
                    const area = await sequelize.models.AreaReport.findOne({
                        where: { id: street.dataValues.areaId }
                    });
                    const areaName = area.dataValues.name;
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${street.dataValues.name} ${areaName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    // const incidences = await sequelize.models.IncidentTypes.findAll();
                    // const data = JSON.parse(street.dataValues.report);
                    // const rating =
                    //     100 -
                    //     (incidences[0].weight * data.murder +
                    //         incidences[1].weight * data.kidnap +
                    //         incidences[2].weight * data.armed_robbery);
                    await street.setDataValue("rating", 80);
                    await street.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                }
            }
        }
    );

    StreetReport.associate = models => {
        const { AreaReport } = models;

        StreetReport.belongsTo(AreaReport, {
            foreignKey: "areaId"
        });
    };

    return StreetReport;
};
