module.exports = (sequelize, DataTypes) => {
    const IncidentTypes = sequelize.define(
        "IncidentTypes",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            weight: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        {}
    );
    IncidentTypes.associate = models => {
        // associations can be defined here
    };
    return IncidentTypes;
};
