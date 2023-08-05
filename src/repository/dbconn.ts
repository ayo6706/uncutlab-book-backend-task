import config from "config";

const Sequelize = require("sequelize");
const DBUri = config.get<string>("DBUri");
export const PostgresqlConnect = new Sequelize(DBUri);
