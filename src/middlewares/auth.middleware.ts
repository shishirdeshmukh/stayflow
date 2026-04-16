import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";
import { HTTP_STATUS } from "../constants.ts/http.constants";
import { MESSAGES } from "../constants.ts/messages";
import { TokenPayload } from "../modules/auth/auth.service";

// ─── Authentication ───────────────────────────────────────────
// Verify Wheter JWT token is valid or not

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        // "Bearer eyJhbGc..." → "eyJhbGc..."
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as TokenPayload;

        // set req.user if token is valid
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch {
        next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED_ACCESS));
    }
};

// ─── Authorization ────────────────────────────────────────────
// Check if user has required role(s) to access the route

export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(HTTP_STATUS.FORBIDDEN, "You don't have permission to perform this action"));
        }

        next();
    };
};
