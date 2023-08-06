import config from "config";

const Sequelize = require("sequelize");

const DBUri = config.get<string>("DBUri");
const PostgresqlConnect = new Sequelize(DBUri);

export default PostgresqlConnect;
