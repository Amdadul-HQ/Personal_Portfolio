import { catchAsync } from "../../app/helper/catchAsync";
import { sendResponse } from "../../app/shared/sendResponse";
import  httpStatus  from "http-status";
import { ExperienceService } from "./experience.service";

const createExperience = catchAsync(async(req,res) => {
const file = req.file;

  if (!file) {
    throw new Error('Image file is required');
  }

  const userId = req.user.id;

  const expData = {
    ...req.body,
    companyImage: file.path,
  };
  const result = await ExperienceService.createExperience(expData, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Blog created successfully',
    data: result,
  });
})

const getExperienceDetails = catchAsync(async(req,res) => {
  const {id} = req.params
  const result = await ExperienceService.getExperienceDetails(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Experience retrieved successfully',
    data: result,
  });
})

const getAllExperience = catchAsync(async(req,res) => {
    const result = await ExperienceService.getAllExperience();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Experience retrieved successfully',
    data: result,
  });
})
const updateExperience = catchAsync(async(req,res) => {
  const { id } = req.params;
  const file = req.file;
  const userId = req.user.id;

  const expData = {
    ...req.body,
    userId,
    companyImage: file?.path, // set image URL
  };

  const result = await ExperienceService.updateExperience(id, expData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Experience updated successfully',
    data: result,
  });
})

const deleteExperience = catchAsync(async(req,res) => {
  const { id } = req.params;
  
  const result = await ExperienceService.deleteExperience(id);
  if(result){
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Experience Deleted successfully',
      data: null,
    });
  }
})



export const ExperienceController = {
    createExperience,
    getAllExperience,
    updateExperience,
    deleteExperience,
    getExperienceDetails
}