import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long").optional(),

    phone: z
        .string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
        .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
