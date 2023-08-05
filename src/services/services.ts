import BookService from "./book";
import UserService from "./user";

export type Services = {
    userService: UserService,
    bookService: BookService
};
