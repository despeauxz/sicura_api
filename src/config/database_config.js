require("dotenv").config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: "postgres"
    },
    test: {
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE_TEST || "politico_test",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        use_env_variable: "DATABASE_URL",
        username: process.env.PROD_USERNAME,
        password: process.env.PROD_PASSWORD,
        database: process.env.PROD_DATABASE,
        host: process.env.PROD_HOST,
        dialect: process.env.PROD_DIALECT || "postgres",
        dialectOptions: {
            ssl: true
        },
        logging: false
    }
};
