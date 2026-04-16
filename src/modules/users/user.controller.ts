import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

import { UpdateProfileInput } from "./user.schema";
import * as UserService from "./user.service";
import { HTTP_STATUS } from "../../constants.ts/http.constants";
import { MESSAGES } from "../../constants.ts/messages";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.user authenticate middleware ne set kiya tha
    const user = await UserService.getMyProfile(req.user!.id);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.FETCHED, user));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as UpdateProfileInput;

    const updatedUser = await UserService.updateMyProfile(req.user!.id, data);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.UPDATED, updatedUser));
});

export const getHostProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const host = await UserService.getHostProfile(id as string);

    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.USER.FETCHED, host));
});
