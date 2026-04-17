import { z } from "zod";

export const createPropertySchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title too long"),

    description: z.string().min(20, "Description must be at least 20 characters"),

    pricePerNight: z.number().positive("Price must be positive"),

    maxGuests: z.number().int().min(1, "At least 1 guest required").max(20, "Maximum 20 guests allowed"),

    bedrooms: z.number().int().min(1),
    bathrooms: z.number().int().min(1),

    address: z.string().min(5, "Address too short"),
    city: z.string().min(2, "City required"),
    country: z.string().min(2, "Country required"),

    lat: z.number().optional(),
    lng: z.number().optional(),

    amenityIds: z.array(z.string().uuid()).optional().default([]),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    maxGuests: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
