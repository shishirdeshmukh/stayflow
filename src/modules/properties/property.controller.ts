import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

import { CreatePropertyInput, UpdatePropertyInput, propertyQuerySchema } from "./property.schema";
import * as PropertyService from "./property.service";
import { HTTP_STATUS } from "../../constants/http.constants";
import { MESSAGES } from "../../constants/messages";

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CreatePropertyInput;

    const property = await PropertyService.createProperty(req.user!.id, data);

    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.PROPERTY.CREATED, property));
});

export const getProperties = asyncHandler(async (req: Request, res: Response) => {
    // Query params validate
    const query = propertyQuerySchema.parse(req.query);

    const result = await PropertyService.getProperties(query);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROPERTY.FETCHED, result));
});

export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const property = await PropertyService.getPropertyById(id as string);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROPERTY.FETCHED, property));
});

export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdatePropertyInput;

    const property = await PropertyService.updateProperty(id as string, req.user!.id, data);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.PROPERTY.UPDATED, property));
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await PropertyService.deleteProperty(id as string, req.user!.id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
});
