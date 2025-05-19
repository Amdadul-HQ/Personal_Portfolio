import ApiError from "../../app/error/ApiError";
import  httpStatus  from "http-status";
import prisma from "../../app/shared/prisma";
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { createToken } from "../../app/shared/createToken";
import config from "../../app/config";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IAuthUser extends User {
    authSecret:string
}

const createUserInToDB = async (payload:Partial<IAuthUser>) => {
const { name, email, password,authSecret } = payload;

if(authSecret !== config.authSecret){
    throw new ApiError(httpStatus.NON_AUTHORITATIVE_INFORMATION,'Authorize Secret not provided')
}
  // Optional: Add validation checks here.
  if (!name || !email || !password || !authSecret) {
    throw new ApiError(
      httpStatus.NON_AUTHORITATIVE_INFORMATION,
      'Missing required fields'
    );
  }

  const isExistUser = await prisma.user.findFirst({
    where: { email },
  });


  if (isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const hasPassword = await bcrypt.hash(password, 10);
  if (!hasPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bcrypt solt generate problem');
  }
  const registeredUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hasPassword,
    },
  });

  if (!registeredUser.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user create problem');
  }
  const jwtPayload = {
    id: registeredUser.id,
    name: registeredUser.name,
    email: registeredUser.email,
    role: registeredUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_scret as string,
    config.jwt.expires_in as string
  );
  return accessToken;
}

const authLogingInToDb = async (payload: Partial<IAuthUser>) => {


  if(payload.authSecret !== config.authSecret){
    throw new ApiError(httpStatus.NON_AUTHORITATIVE_INFORMATION,'Authorize Secret not provided')
}

  if (!payload.email || !payload.password) {
    throw new ApiError(
      httpStatus.NON_AUTHORITATIVE_INFORMATION,
      'Missing required fields'
    );
  }
  const isExistUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (!isExistUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invilide email or password please try agin'
    );
  }

  const checkPassword = await bcrypt.compare(
    payload.password,
    isExistUser?.password
  );

  if (!checkPassword) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invilide email or password please try agin'
    );
  }
  const jwtPayload = {
    id: isExistUser.id,
    name: isExistUser.name,
    email: isExistUser.email,
    role: isExistUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_scret as string,
    config.jwt.expires_in as string
  );
  const refeshToken = createToken(
    jwtPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  const result = {
    accessToken,
    refeshToken,
  };
  return result;
};


const refeshTokenInToForDb = async (paylood: string) => {
  const decode = jwt.verify(paylood, config.jwt.refresh_token_secret as string);

  const { email, role } = decode as JwtPayload;
  if (!decode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'you ar not authorized');
  }
  const isExistUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'you ar not authorized');
  }
  const jwtPayload = {
    id: isExistUser.id,
    name: isExistUser.name,
    email: isExistUser.email,
    role: isExistUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_scret as string,
    config.jwt.expires_in as string
  );
  return {
    accessToken,
  };
};

export const AuthService = {
    createUserInToDB,
    authLogingInToDb,
    refeshTokenInToForDb
}