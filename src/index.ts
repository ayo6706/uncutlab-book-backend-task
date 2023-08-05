import dotenv from "dotenv";
import config from "config";
import Http from "./http/http";
import { Services } from "./services/services";
import { useLogger, log, createLogger } from "./log";
import RepositoryLogger from "./repository/log";
import ServicesLogger from "./services/log";
import HttpLogger from "./http/log";
import UserRepositoryPostgreSql from "./repository/user/user.postgresql";
import UserService from "./services/user";
import { PostgresqlConnect } from "./repository/dbconn";
import BookService from "./services/book";
import BookRepositoryPostgreSql from "./repository/book/model.postgresql";

const RepositoryLoggerID = "DB";
const ServiceLoggerID = "SRV";
const HTTPLoggerID = "HTTP";
const SystemLoggerID = "SYS";

const DBUri = config.get<string>("DBUri");
const PORT = config.get<string>("PORT");
const API_VERSION = config.get<string>("API_VERSION");

function initLoggers() {
    useLogger(createLogger(SystemLoggerID, DBUri));
    RepositoryLogger.useLogger(createLogger(RepositoryLoggerID, DBUri));
    ServicesLogger.useLogger(createLogger(ServiceLoggerID, DBUri));
    HttpLogger.useLogger(createLogger(HTTPLoggerID, DBUri));
}

function main(): void {
    dotenv.config();
    initLoggers();

    PostgresqlConnect.sync()
        .then(() => { log.info(`connected to db successfully on ${DBUri}`); })
        .catch((err: any) => log.error(`db connection error: ${err}`));

    const services: Services = {
        userService: new UserService(
            new UserRepositoryPostgreSql(),
        ),
        bookService: new BookService(
            new BookRepositoryPostgreSql(),
        ),
    };

    const http = new Http(services);
    // start http server on declared port
    http.serve(process.env.PORT || PORT, API_VERSION);
}

main();
