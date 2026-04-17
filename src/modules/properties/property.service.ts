import { ApiError } from "../../utils/ApiError";

import { CreatePropertyInput, UpdatePropertyInput, PropertyQueryInput } from "./property.schema";
import * as PropertyRepository from "./property.repository";
import { HTTP_STATUS } from "../../constants.ts/http.constants";
import { MESSAGES } from "../../constants.ts/messages";

export const createProperty = async (hostId: string, data: CreatePropertyInput) => {
    const property = await PropertyRepository.createProperty(hostId, data);
    return property;
};

export const getProperties = async (query: PropertyQueryInput) => {
    const { total, properties, page, limit } = await PropertyRepository.findProperties(query);

    // Pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
        properties,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

export const getPropertyById = async (id: string) => {
    const property = await PropertyRepository.findPropertyById(id);

    if (!property) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROPERTY.NOT_FOUND);
    }

    return property;
};

export const updateProperty = async (propertyId: string, hostId: string, data: UpdatePropertyInput) => {
    // check if property exists and belongs to host
    const existing = await PropertyRepository.findPropertyByIdAndHostId(propertyId, hostId);

    if (!existing) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROPERTY.NOT_FOUND);
    }

    return PropertyRepository.updateProperty(propertyId, data);
};

export const deleteProperty = async (propertyId: string, hostId: string) => {
    // check if property exists and belongs to host
    const existing = await PropertyRepository.findPropertyByIdAndHostId(propertyId, hostId);

    if (!existing) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.PROPERTY.NOT_FOUND);
    }

    await PropertyRepository.deleteProperty(propertyId);
};
