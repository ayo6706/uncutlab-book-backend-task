import express, { Router } from "express";
import passport from "passport";

export default function routes(handler: any): express.Router {
    const router = Router();
    router.post(
        "/",
        passport.authenticate("jwt", { session: false }),
        handler.createBook.bind(handler),
    );
    router.patch(
        "/",
        passport.authenticate("jwt", { session: false }),
        handler.updateBook.bind(handler),
    );
    router.get(
        "/",
        passport.authenticate("jwt", { session: false }),
        handler.getBooks.bind(handler),
    );
    router.delete(
        "/",
        passport.authenticate("jwt", { session: false }),
        handler.deleteBook.bind(handler),
    );
    return router;
}
