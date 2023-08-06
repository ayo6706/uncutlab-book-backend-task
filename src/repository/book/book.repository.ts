import { Book } from "./model";

export default interface BookRepository {
    createBook(book: Book): Promise<Book>;
    getBooks(
        searchText?:
        string,
        author?: string,
        page?: number,
        limit?: number
    ): Promise<Book[]>;
    updateBook(bookObj: Book): Promise<Book>
    deleteBook(id: string): Promise<Book>
    getBookByTitle(title: string): Promise<Book>
    getBookById(id: string): Promise<Book>
}
