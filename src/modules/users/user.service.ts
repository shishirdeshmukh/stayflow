import { ApiError } from "../../utils/ApiError";
import { UpdateProfileInput } from "./user.schema";
import * as UserRepository from "./user.repository";
import { HTTP_STATUS } from "../../constants/http.constants";
import { MESSAGES } from "../../constants/messages";

export const getMyProfile = async (userId: string) => {
    const user = await UserRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    return user;
};

export const updateMyProfile = async (userId: string, data: UpdateProfileInput) => {
    //check user exist
    const user = await UserRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const updatedUser = await UserRepository.updateUserById(userId, data);

    return updatedUser;
};

export const getHostProfile = async (hostId: string) => {
    const host = await UserRepository.findHostById(hostId);

    if (!host) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    return host;
};
