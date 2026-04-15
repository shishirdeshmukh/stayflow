import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { HTTP_STATUS } from "../../constants.ts/http.constants";
import { MESSAGES } from "../../constants.ts/messages";
import * as AuthService from "./auth.service";
import { RegisterInput, LoginInput } from "./auth.schema";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../../utils/constant";


export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as RegisterInput;

    const { user, accessToken, refreshToken } =
      await AuthService.registerUser(data);

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        MESSAGES.AUTH.REGISTER_SUCCESS,
        { user, accessToken }
      )
    );
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as LoginInput;

    const { user, accessToken, refreshToken } =
      await AuthService.loginUser(data);

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        MESSAGES.AUTH.LOGIN_SUCCESS,
        { user, accessToken }
      )
    );
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        MESSAGES.AUTH.LOGOUT_SUCCESS,
        null
      )
    );
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(
        new ApiResponse(
          HTTP_STATUS.UNAUTHORIZED,
          MESSAGES.AUTH.TOKEN_INVALID,
          null
        )
      );
      return;
    }

    const { accessToken } = AuthService.refreshAccessToken(token);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, "Token refreshed", { accessToken })
    );
  }
);