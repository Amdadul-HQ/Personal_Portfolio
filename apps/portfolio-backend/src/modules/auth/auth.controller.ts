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

export const AuthController = {
    createUser
}