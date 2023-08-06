import {
    NextFunction, Request, Response, Router,
} from "express";
import BookService from "../../../services/book";
import { Handler } from "../handler";
import routes from "./routes";
import AuthRequest from "../../../@types/authRequest";
import { fieldIsNotEmpty } from "../util";
import * as errors from "../../response/errors";
import { ok } from "../../response/response";

 /**
  * @openapi
  * tags:
  *   name: Book
  *   description: Manage Book data
  */

const basePath = "/book";
export default class BookHandler implements Handler {
    private service: BookService;

    constructor(service: BookService) {
        this.service = service;
    }

    path(): string {
        return basePath;
    }

    routes(): Router {
        return routes(this);
    }

      /**
     * @openapi
     * /book:
     *   post:
     *     tags:
     *      - Book
     *     summary: create a new book
     *     requestBody:
     *      $ref: '#/components/requestBodies/Book'
     *     responses:
     *        200:
     *          description: book successfully created
     *     security:
     *      - bearerAuth: []
     */
    async createBook(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const {
                title,
                author,
            } = req.body;
            if (!fieldIsNotEmpty(title)) {
                return next(errors.ErrMissingParameter);
            }
            const book = {
                title,
                author,
            };
            const result = await this.service.createBook(
                book,
            );
            return ok("book successfully created", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }


     /**
     * @openapi
     * /book:
     *   patch:
     *     tags:
     *      - Book
     *     summary: update a book
     *     requestBody:
     *      $ref: '#/components/requestBodies/UpdateBook'
     *     responses:
     *        200:
     *          description: book successfully updated
     *     security:
     *      - bearerAuth: []
     */
     async updateBook(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const {
                id,
                title,
                author,
            } = req.body;
            if (!fieldIsNotEmpty(id)) {
                return next(errors.ErrMissingParameter);
            }
            const book = {
                id,
                title,
                author,
            };
            const result = await this.service.updateBook(
                book,
            );
            return ok("book successfully updated", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }

    /**
     * @openapi
     * /book/find:
       *   get:
     *    summary: get books
     *    tags:
     *      - Book
     *    parameters:
     *     - in: query
     *       name: searchText
     *       schema:
     *        type: string
     *        default: "book name"
     *     - in: query
     *       name: author
     *       schema:
     *        type: string
     *        default: ayomide
     *     - in: query
     *       name: page
     *       schema:
     *        type: integer
     *        default: 1
     *     - in: query
     *       name: limit
     *       schema:
     *        type: integer
     *        default: 2
     *    responses:
     *     200:
     *      description: gotten books
     */
    async getBooks(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            let searchText: string; let author: string; let page: number;
            let limit: number;

            if (req.query) {
                const q = req.query;
                searchText = q.searchText as any;
                author = q.author as any;
                page = q.page as any;
                limit = q.limit as any;
            } else {
                return next(errors.ErrMissingParameter);
            }

            const result = await this.service.getBooks(searchText, author, page, limit);
            return ok("gotten books", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }


    /**
     * @openapi
     * /book:
       *   get:
     *    summary: get books
     *    tags:
     *      - Book
     *    parameters:
     *     - in: query
     *       name: id
     *       schema:
     *        type: string
     *        default: 2
     *    responses:
     *     200:
     *      description: gotten books
     */
    async getBook(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            let id: string; 

            if (req.query.id) {
                id = req.query.id as any;

            } else {
                return next(errors.ErrMissingParameter);
            }

            const result = await this.service.getBook(id);
            return ok("gotten book", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
      /**
     * @openapi
     * /book:
     *   delete:
     *    summary: delete a book using its ID
     *    tags:
     *      - Book
     *    parameters:
     *     - in: query
     *       name: id
     *       schema:
     *        type: string
     *        default: a923afkjahaq
     *    responses:
     *     200:
     *      description: deleted book
     */
    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.query.id as string;
            if (!fieldIsNotEmpty(id)) {
                return next(errors.ErrMissingParameter);
            }

            const result = await this.service.deleteBook(id);
            return ok("deleted book", result).send(res);
        } catch (error: any) {
            return next(error);
        }
    }
}
