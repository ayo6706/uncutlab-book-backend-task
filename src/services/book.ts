import { BookDto } from "../dto/book/book.dto";
import BookMapper from "../dto/book/book.mapper";
import BookRepository from "../repository/book/book.repository";
import { failedPromise } from "./util";

export default class BookService {
    constructor(private readonly repo: BookRepository) {}

    async createBook(book: BookDto): Promise<BookDto> {
        try {
            const bookExists = await this.repo.getBookByTitle(book.title!);
            if (bookExists) {
                return failedPromise("book already exists");
            }

            const result = await this.repo.createUser(book);
            return BookMapper.toDto(result);
        } catch (error: any) {
            return failedPromise(error);
        }
    }

    async updateBook(book: BookDto): Promise<BookDto> {
        try {
            const bookExists = await this.repo.getBookById(book.id!);

            if (!bookExists) {
                return failedPromise("Book not found");
            }

            const updatedBook = await this.repo.updateBook(book);
            return BookMapper.toDto(updatedBook);
        } catch (error: any) {
            return failedPromise(error);
        }
    }

    async deleteBook(id: string): Promise<BookDto> {
        try {
            const bookExists = await this.repo.getBookById(id);

            if (!bookExists) {
                return failedPromise("Book not found");
            }

            const result = await this.repo.deleteBook(id);
            return BookMapper.toDto(result);
        } catch (error: any) {
            return failedPromise(error);
        }
    }

    async getBooks(
        searchText?: string,
        author?: string,
        page?: number,
        limit?: number,
    ): Promise<BookDto[]> {
        try {
            const books = await this.repo.getBooks(
                searchText,
                author,
                page,
                limit,
            );
            return BookMapper.toDtoArray(books);
        } catch (error: any) {
            return failedPromise(error);
        }
    }
}