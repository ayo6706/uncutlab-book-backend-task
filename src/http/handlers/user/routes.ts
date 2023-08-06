import express from "express";
import passport from "passport";

export default function routes(handler: any): express.Router {
    const router = express.Router();
    router.post("/register", handler.registerUser.bind(handler));
    router.post("/login", handler.loginUser.bind(handler));
    router.patch("/profile", passport.authenticate("jwt", { session: false }), handler.updateUser.bind(handler));
    router.get("/profile", passport.authenticate("jwt", { session: false }), handler.getUserProfile.bind(handler));

    router.post("/change-password", passport.authenticate("jwt", { session: false }), handler.changePassword.bind(handler));
    return router;
}
