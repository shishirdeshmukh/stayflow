import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/database";
import { ApiError } from "../../utils/ApiError";
import { RegisterInput, LoginInput } from "./auth.schema";
import { Role } from "@prisma/client";
import { HTTP_STATUS } from "../../constants.ts/http.constants";
import { MESSAGES } from "../../constants.ts/messages";

// ─── Token Helpers ────────────────────────────────────────────

export interface TokenPayload {
    id: string;
    email: string;
    role: Role;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"],
    });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
    });
};

// ─── Register ─────────────────────────────────────────────────

export const registerUser = async (data: RegisterInput) => {
    // 1. Email already exists?
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    // 2. Password hash
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 3. Create User
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            createdAt: true,
        },
    });

    // 4. generate Tokens
    const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────

export const loginUser = async (data: LoginInput) => {
    // 1.Search User
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    // 2. Check for user Existence
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // 3. Password Check
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // 4. Tokens generate
    const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // passwordHash should not be sent in response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

// ─── Refresh Token ────────────────────────────────────────────

export const refreshAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;

        const accessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        });

        return { accessToken };
    } catch {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED_ACCESS);
    }
};
