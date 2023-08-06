import express, { Router } from "express";
import passport from "passport";
import uploadFile from "../../../lib/file";

export default function routes(handler: any): express.Router {
    const router = Router();
    router.post(
        "/",
        passport.authenticate("jwt", { session: false }),
        uploadFile.single("bookFile"),
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
        handler.getBook.bind(handler),
    );
    router.get(
        "/find",
        handler.getBooks.bind(handler),
    );
    router.delete(
        "/",
        passport.authenticate("jwt", { session: false }),
        handler.deleteBook.bind(handler),
    );
    return router;
}
