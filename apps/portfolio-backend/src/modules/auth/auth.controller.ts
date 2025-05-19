import { catchAsync } from "../../app/helper/catchAsync";
import { sendResponse } from "../../app/shared/sendResponse";
import  httpStatus  from "http-status";
import { AuthService } from "./auth.service";


const createUser = catchAsync(async(req,res) => {
    const result = await AuthService.createUserInToDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Created Successfully',
      data: {
        accessToken: result,
      },
    });
})

const logingUser = catchAsync(async (req, res) => {
  const result = await AuthService.authLogingInToDb(req.body);

  res.cookie('refeshToken', result.refeshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User Successfully login',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refeshToken = catchAsync(async (req, res) => {
  const { refeshToken } = req.cookies;
  const result = await AuthService.refeshTokenInToForDb(refeshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'refesh token Successfully get the access',
    data: result,
  });
});

export const AuthController = {
    createUser,
    logingUser,
    refeshToken
}