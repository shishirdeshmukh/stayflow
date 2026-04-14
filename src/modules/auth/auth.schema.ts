import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .nonempty("Name is Required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long"),

    email: z
        .string()
        .nonempty("Email is Required")
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .nonempty("Password is Required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),

    role: z.enum(["GUEST", "HOST"]).default("GUEST"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .toLowerCase(),

    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;