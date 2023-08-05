import { Op } from "sequelize";
import BookRepository from "./book.repository";
import { log } from "../log";
import DatabaseError from "../../errors/database";
import { PostgresqlConnect } from "../dbconn";
import BookModel from "./book.postgresql";
import { Book } from "./model";

const BookDB = BookModel(PostgresqlConnect);

export default class BookRepositoryPostgreSql implements BookRepository {
    async createUser(book: Book): Promise<Book> {
        try {
            const createdUser = await BookDB.create({
                title: book.title,
                author: book.author,
            });
            return Promise.resolve(createdUser);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async getBooks(searchText?: string, author?: string, page = 1, limit = 10): Promise<Book[]> {
        try {
           // Build the filter object based on search and filtering parameters
            const filter: any = {};
            if (searchText) {
                filter[Op.or] = [
                    { title: { [Op.iLike]: `%${searchText}%` } },
                    { author: { [Op.iLike]: `%${searchText}%` } },
                ];
            }
            if (author) {
                filter.author = {
                    [Op.iLike]: `%${author}%`,
                };
            }

            // Calculate offset and limit for pagination
            const pageNumber = parseInt(page as unknown as string) || 1;
            const itemsPerPage = parseInt(limit as unknown as string) || 10;
            const offset = (pageNumber - 1) * itemsPerPage;

            const books = await BookDB.findAll({
                where: filter,
                offset,
                limit: itemsPerPage,
            });

            return Promise.resolve(books);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async updateBook(bookObj: Book): Promise<Book> {
        try {
            const book = await BookDB.findByPk(bookObj.id);

            if (!book) {
                return Promise.reject(book);
            }

            book.title = bookObj.title!;
            book.author = bookObj.author!;
            await book.save();
            return Promise.resolve(book);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async deleteBook(id: string): Promise<Book> {
        try {
            const book = await BookDB.findByPk(id);
            await book!.destroy();
            return Promise.resolve(book!);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async getBookByTitle(title: string): Promise<Book> {
        try {
            const book = await BookDB.findOne({
                where: {
                    title: {
                        [Op.iLike]: `%${title}%`, // Case-insensitive search
                    },
                },
            });

            return Promise.resolve(book!);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }

    async getBookById(id: string): Promise<Book> {
        try {
            const book = await BookDB.findByPk(id);
            return Promise.resolve(book!);
        } catch (error: any) {
            log.error(error);
            throw new DatabaseError(error);
        }
    }
}
