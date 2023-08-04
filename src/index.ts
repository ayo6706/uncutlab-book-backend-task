import dotenv from "dotenv";
import config from "config";
import Http from "./http/http";
import { Services } from "./services/services";
import UserService from "./services/user";
import UserRepositoryMongo from "./repository/user/user.mongo";
import { useLogger, log, createLogger } from "./log";
import RepositoryLogger from "./repository/log";
import ServicesLogger from "./services/log";
import HttpLogger from "./http/log";
const Pool = require('pg').Pool

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

// function closeMongooseConnection(): Promise<void> {
//     return new Promise((resolve) => {
//         Pool.(() => {
//             log.info("MongoDB connection closed due to Node.js process termination");
//             resolve();
//         });
//     });
// }

function main(): void {
    dotenv.config();
    initLoggers();

    new Pool({
            user: 'me',
            host: 'localhost',
            database: 'api',
            password: 'password',
            port: 5432,
    }).then(() => { log.info(`connected to db successfully on ${DBUri}`); })
    .catch((err: any) => log.error(`db connection error: ${err}`));


    // Add event listener to close MongoDB and redis connection when Node.js process is terminated
    process.on("SIGINT", async () => {
        // await closeMongooseConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        // await closeMongooseConnection();
        process.exit(0);
    });

    // scheduler
    const userRepo = new UserRepositoryMongo();
    const services: Services = {
        userService: new UserService(
            userRepo,
        ),
    };
    const http = new Http(services);
    // start http server on declared port
    http.serve(process.env.PORT || PORT, API_VERSION);
}

main();
