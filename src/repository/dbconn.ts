const Sequelize = require("sequelize");

export const PostgresqlConnect = new Sequelize("dbConfig.DB", "dbConfig.USER", "dbConfig.PASSWORD", {
    host: "dbConfig.HOST",
    dialect: "postgres",
    operatorsAliases: false,

});
