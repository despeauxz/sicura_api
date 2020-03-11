import axios from "axios";

module.exports = (sequelize, DataTypes) => {
    const StateReport = sequelize.define(
        "StateReport",
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
            capital: {
                type: DataTypes.STRING,
                allowNull: false
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
            geolocation: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            hooks: {
                beforeCreate: async state => {
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${state.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await state.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                },
                beforeUpdate: async state => {
                    const value = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${state.dataValues.name}, Nigeria&key=b7921c262e3b446eb56391139d4812f9&language=en&pretty=1`
                    );
                    await state.setDataValue(
                        "geolocation",
                        JSON.stringify(value.data)
                    );
                }
            }
        }
    );

    StateReport.associate = models => {
        const { LgaReport } = models;

        StateReport.hasMany(LgaReport, {
            foreignKey: "stateId",
            as: "lgas"
        });
    };

    return StateReport;
};
