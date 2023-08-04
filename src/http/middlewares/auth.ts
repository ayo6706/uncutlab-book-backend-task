import { StrategyOptions, ExtractJwt, Strategy } from "passport-jwt";
import config from "config";


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

