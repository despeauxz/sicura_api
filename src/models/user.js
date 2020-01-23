import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const salt = process.env.SALT || 5;

const SALT_ROUNDS = parseInt(salt, 10);

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false
            },
            username: {
                type: DataTypes.CITEXT,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.CITEXT,
                allowNull: false,
                unique: true
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female"),
                allowNull: true
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            hooks: {
                beforeCreate: user => User.hashPassword(user),
                beforeUpdate: user => User.hashPassword(user)
            }
        }
    );

    User.associate = models => {

    };
    User.hashPassword = async user => {
        const changedDbValue = await user.changed(
            "password",
            user.dataValues.password
        );
        if (
            changedDbValue._previousDataValues.password
            !== changedDbValue.dataValues.password
        ) {
            const hash = await bcrypt.hash(
                user.dataValues.password,
                SALT_ROUNDS
            );
            await user.setDataValue("password", hash);
        }
    };

    return User;
};
