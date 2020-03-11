import axios from "axios";
// import StateData from "./";
// const { StateReport } = models;

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
            report: {
                type: DataTypes.TEXT,
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
        {
            hooks: {
                beforeCreate: async lga => {
                    // const state = await sequelize.models.StateReport.findOne({
                    //     where: { id: lga.dataValues.stateId }
                    // });
                    // const stateName = state.dataValues.name;
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${lga.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await lga.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                },
                beforeUpdate: async lga => {
                    const state = await sequelize.models.StateReport.findOne({
                        where: { id: lga.dataValues.stateId }
                    });
                    const stateName = state.dataValues.name;
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${lga.dataValues.name}, ${stateName}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await lga.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                }
            }
        }
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
