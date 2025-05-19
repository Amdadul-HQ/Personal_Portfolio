import { catchAsync } from "../../app/helper/catchAsync";
import { sendResponse } from "../../app/shared/sendResponse";
import  httpStatus  from "http-status";
import { ProjectService } from "./projects.service";
import { IProjectFilterRequest } from "./project.interface";
import pick from "../../app/shared/pick";
import { projectFilterableFields } from "./projects.constant";

const createProject = catchAsync(async(req,res) => {
const file = req.file;

  if (!file) {
    throw new Error('Image file is required');
  }

  const userId = req.user.id;

  const projectData = {
    ...req.body,
    siteMockup: file.path,
  };
  const result = await ProjectService.createProjectInToDB(projectData, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Project created successfully',
    data: result,
  });
})

const getAllProjects = catchAsync(async (req, res) => {
  const rawFilters = pick(req.query, projectFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  // const user = req.user;

  // Handle boolean conversion for 'isPublic' and 'isPaid' and ensure other filters are correctly handled
  const filters: IProjectFilterRequest = {
    isFeatured:
      rawFilters.isFeatured === 'true'
        ? true : false,
    searchTerm:
      typeof rawFilters.searchTerm === 'string'
        ? rawFilters.searchTerm
        : undefined,
  };

  // If filters are empty, set them to undefined to fetch all events
  if (
    Object.keys(filters).length === 0 ||
    Object.values(filters).every((value) => value === undefined)
  ) {
    filters.isFeatured = undefined;
    filters.searchTerm = undefined;
  }

  const result = await ProjectService.getAllProjectFromDB(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Projects retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const userId = req.user.id;

  const blogData = {
    ...req.body,
    userId,
    eventImgUrl: file?.path, // set image URL
  };

  const result = await ProjectService.updateProjectInToDB(id, blogData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Project updated successfully',
    data: result,
  });
});

const getProjectDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await ProjectService.getProjectDetailsFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async(req,res) => {
 const { id } = req.params;
  
  const result = await ProjectService.deleteProjectFromDB(id);
  if(result){
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Project Deleted successfully',
      data: null,
    });
  }
})



export const ProjectController = {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectDetails

}