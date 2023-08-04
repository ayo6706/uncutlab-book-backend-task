/* eslint-disable no-console */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import config from "config";

import { log } from "./log";

import { Services } from "../services/services";

const apiPath = "/api";
const NODE_ENV = config.get<string>("NODE_ENV");
// Http provides a port to interact with the app using http implementations such as a REST API
export default class Http {

    private apiVersion: string = "";

    constructor(services: Services) {

    }

    basePath(handlerPath: string): string {
        return `${apiPath}/${this.apiVersion}${handlerPath}`;
    }

    // serve takes a port as an argument and starts an express server on the specified port
    serve(port: string, version: string) {
        this.apiVersion = version;

        const app = express();
        app.use(cors());
        // TODO: replace body parser with express parser
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // passport
        app.use(passport.initialize());
     

        // register handler routes
        app.get("/", (req, res) => {
            res.send("edubaloo backend service");
        });

        if (NODE_ENV !== "test") {
            app.listen(port, () => { log.info("starting express server"); });
        }
        return app;
    }
}
