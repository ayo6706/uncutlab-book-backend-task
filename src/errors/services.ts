export const serverError = new Error("Server Error");
export const dbError = new Error("DB Error");
export class ServiceError extends Error {
    constructor(readonly err: Error | string) {
        super(function narrow(): string {
            if (err instanceof Error) {
                return err.message;
            }
            return err;
        }());
        this.name = "ServiceError";
    }
}
