import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import logger from "../utils/logger";
import { HTTP_STATUS } from "../constants/http.constants";
import { MESSAGES } from "../constants/messages";

export const errorMiddleware = (err: Error, req: Request, res: Response): void => {
    // Log every error with full stack trace
    logger.error(err);

    // If it's our own ApiError (operational error)
    if (err instanceof ApiError) {
        res.status(err.statuscode).json(new ApiResponse(err.statuscode, err.message, null));
        return;
    }

    // Unknown/unexpected error — don't leak details to client
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.GENERAL.SOMETHING_WENT_WRONG, null)
    );
};
