import { NextFunction, Request, Response } from 'express';
import { Jwthelper } from '../helper/jwtHelper';
import config from '../config';
import ApiError from '../error/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorize!!');
      }

      const varifiedUser = Jwthelper.verifyToken(
        token as string,
        config.jwt.jwt_scret as string
      ) as JwtPayload;

      if (roles.length && !roles.includes(varifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are Forbidden!!');
      }

      req.user = varifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
