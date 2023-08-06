import { StrategyOptions, ExtractJwt, Strategy } from "passport-jwt";
import { NextFunction, Response } from "express";
import config from "config";
import AuthRequest from "../../@types/authRequest";
import { ErrUnauthorizedUser } from "../response/errors";
import { PostgresqlConnect } from "../../repository/dbconn";
import UserModel from "../../repository/user/model.postgresql";
import User from "../../repository/user/model";

const JWT_SECRET = config.get<string>("JWT_SECRET");
/**
 * StrategyOptions interface
 * Using passport-jwt
 */
const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    passReqToCallback: true,
};
const UserDB = UserModel(PostgresqlConnect);

export default new Strategy(
    opts,
    ((req: AuthRequest, jwtToken: any, done: any) => {
        UserDB.findByPk(jwtToken.id)
            .then((user: User | null) => {
                if (user) {
                    req.user = user;
                    return done(undefined, user, jwtToken);
                }
                return done(undefined, false);
            })
            .catch((err: any) => done(err, false));
    }),
);
