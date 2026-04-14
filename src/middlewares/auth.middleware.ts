import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

const jwtSecret = process.env.JWT_ACCESS_SECRET;
const jwtExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"];

if (!jwtSecret) {
  throw new Error("JWT_ACCESS_SECRET must be defined");
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};
