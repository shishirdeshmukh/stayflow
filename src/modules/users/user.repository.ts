import prisma from "../../config/database";
import { UpdateProfileInput } from "./user.schema";

export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            phone: true,
            isVerified: true,
            createdAt: true,
        },
    });
};

export const findHostById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true,
            properties: {
                where: { isAvailable: true },
                select: {
                    id: true,
                    title: true,
                    city: true,
                    country: true,
                    pricePerNight: true,
                    images: {
                        where: { isPrimary: true },
                        select: { url: true },
                        take: 1,
                    },
                },
            },
        },
    });
};

export const updateUserById = async (id: string, data: UpdateProfileInput) => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            phone: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
