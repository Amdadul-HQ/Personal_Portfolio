import { catchAsync } from "../../app/helper/catchAsync";
import { sendResponse } from "../../app/shared/sendResponse";
import  httpStatus  from "http-status";
import pick from "../../app/shared/pick";
import { SkillsService } from "./skills.service";

const createSkills = catchAsync(async(req,res) => {
  const file = req.file;

  if (!file) {
    throw new Error('Image file is required');
  }

  const userId = req.user.id;

  const skillData = {
    ...req.body,
    image: file.path,
  };
  const result = await SkillsService.createSkill(skillData, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Skill created successfully',
    data: result,
  });
})


const getSkills = catchAsync(async (req, res) => {

  const result = await SkillsService.getAllSkills();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Skills retrieved successfully',
    data: result,
  });
});

const getSkillsDetails = catchAsync(async(req,res) => {
  const {id} = req.params
  const result = await SkillsService.getSkillsDetails(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Skills retrieved successfully',
    data: result,
  });
})

const updateSkill= catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const userId = req.user.id;

  const skillData = {
    ...req.body,
    userId,
    eventImgUrl: file?.path, // set image URL
  };

  const result = await SkillsService.updateSkillIntoDB(id, skillData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Skill updated successfully',
    data: result,
  });
});

const deleteSkill = catchAsync(async(req,res) => {
 const { id } = req.params;
  
  const result = await SkillsService.deleteSkillFromDB(id);
  if(result){
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Skill Deleted successfully',
      data: null,
    });
  }
})

export const SkillController = {
    createSkills,
    getSkills,
    updateSkill,
    deleteSkill,
    getSkillsDetails
}