import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/http.constants";
import { MESSAGES } from "../constants/messages";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            next(new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.GENERAL.VALIDATION_ERROR));
            return;
        }

        // Sanitized + parsed data se req.body replace karo
        req.body = result.data;
        next();
    };
};
