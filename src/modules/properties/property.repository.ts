import prisma from "../../config/database";
import { CreatePropertyInput, UpdatePropertyInput, PropertyQueryInput } from "./property.schema";

export const createProperty = async (hostId: string, data: CreatePropertyInput) => {
    const { amenityIds, ...propertyData } = data;

    return prisma.property.create({
        data: {
            ...propertyData,
            hostId,
            // Many-to-many amenities connect
            amenities: {
                create: amenityIds.map((amenityId) => ({
                    amenity: { connect: { id: amenityId } },
                })),
            },
        },
        include: {
            images: true,
            amenities: {
                include: { amenity: true },
            },
            host: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
};

export const findProperties = async (query: PropertyQueryInput) => {
    const { city, country, minPrice, maxPrice, maxGuests, page, limit } = query;

    const skip = (page - 1) * limit;

    // Dynamic filters
    const where: any = {
        isAvailable: true,
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(country && { country: { contains: country, mode: "insensitive" } }),
        ...(maxGuests && { maxGuests: { gte: maxGuests } }),
        ...(minPrice || maxPrice
            ? {
                  pricePerNight: {
                      ...(minPrice && { gte: minPrice }),
                      ...(maxPrice && { lte: maxPrice }),
                  },
              }
            : {}),
    };

    // fetch Total count + paginated results
    const [total, properties] = await prisma.$transaction([
        prisma.property.count({ where }),
        prisma.property.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                host: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: { reviews: true },
                },
            },
        }),
    ]);

    return { total, properties, page, limit };
};

export const findPropertyById = async (id: string) => {
    return prisma.property.findUnique({
        where: { id },
        include: {
            images: true,
            amenities: {
                include: { amenity: true },
            },
            host: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    createdAt: true,
                },
            },
            _count: {
                select: { reviews: true },
            },
        },
    });
};

export const updateProperty = async (id: string, data: UpdatePropertyInput) => {
    const { amenityIds, ...propertyData } = data;

    return prisma.property.update({
        where: { id },
        data: {
            ...propertyData,
            //update Amenities  — first delete existing relations then create new ones
            ...(amenityIds !== undefined && {
                amenities: {
                    deleteMany: {},
                    create: amenityIds.map((amenityId) => ({
                        amenity: { connect: { id: amenityId } },
                    })),
                },
            }),
        },
        include: {
            images: true,
            amenities: {
                include: { amenity: true },
            },
        },
    });
};

export const deleteProperty = async (id: string) => {
    return prisma.property.delete({ where: { id } });
};

export const findPropertyByIdAndHostId = async (id: string, hostId: string) => {
    return prisma.property.findFirst({
        where: { id, hostId },
    });
};
