import bcrypt from "bcrypt";

const salt = process.env.SALT || 5;
// eslint-disable-next-line radix
const SALT_ROUNDS = parseInt(salt);

module.exports = (sequelize, DataTypes) => {
    const VerifyToken = sequelize.define(
        "VerifyToken",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            verifyToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tokenExpiry: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            hooks: {
                beforeCreate: token => VerifyToken.hashToken(token),
                beforeUpdate: token => VerifyToken.hashToken(token)
            }
        }
    );

    VerifyToken.associate = models => {
        const { User } = models;

        VerifyToken.belongsTo(User, {
            foreignKey: "userId"
        });
    };

    VerifyToken.hashToken = async token => {
        const hash = await bcrypt.hash(
            token.dataValues.verifyToken,
            SALT_ROUNDS
        );
        await token.setDataValue("verifyToken", hash);
    };

    return VerifyToken;
};
