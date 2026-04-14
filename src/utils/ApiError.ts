export class ApiError extends Error {
    statuscode: number;
    isOperational?: boolean;

    constructor(statuscode: number, message: string) {
        super(message);
        this.statuscode = statuscode;
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor);

    }
}