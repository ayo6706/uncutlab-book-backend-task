import { Book } from "../../repository/book/model";
import { BookDto } from "./book.dto";

export default class BookMapper {
    static toDto(book: BookDto): BookDto {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
        };
    }

    static toDtoArray(book: Book[]): BookDto[] {
        const results: BookDto[] = [];
        for (let i = 0; i < book.length; i++) {
            results.push(this.toDto(book[i]));
        }
        return results;
    }
}
