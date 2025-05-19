import { catchAsync } from "../../app/helper/catchAsync";
import { sendResponse } from "../../app/shared/sendResponse";
import  httpStatus  from "http-status";
import { BlogService } from "./blogs.service";
import { IBlogFilterRequest } from "./blogs.interface";
import pick from "../../app/shared/pick";
import { blogFilterableFields } from "./blogs.constant";

const createBlog = catchAsync(async(req,res) => {
  const file = req.file;

  if (!file) {
    throw new Error('Image file is required');
  }

  const userId = req.user.id;

  const blogData = {
    ...req.body,
    thumbnail: file.path,
  };
  const result = await BlogService.createBlogIntoDB(blogData, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Blog created successfully',
    data: result,
  });
})


const getBlogs = catchAsync(async (req, res) => {
  const rawFilters = pick(req.query, blogFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  // const user = req.user;

  // Handle boolean conversion for 'isPublic' and 'isPaid' and ensure other filters are correctly handled
  const filters: IBlogFilterRequest = {
  isFeatured: rawFilters.isFeatured === 'true' ? true : rawFilters.isFeatured === 'false' ? false : undefined,
  searchTerm: typeof rawFilters.searchTerm === 'string' ? rawFilters.searchTerm : undefined,
};

  // If filters are empty, set them to undefined to fetch all events
  if (
    Object.keys(filters).length === 0 ||
    Object.values(filters).every((value) => value === undefined)
  ) {
    filters.isFeatured = undefined;
    filters.searchTerm = undefined;
  }

  const result = await BlogService.getAllBlogs(filters, options);

  sendResponse(res, {
  success: true,
  statusCode: httpStatus.OK,
  message: 'Blog retrieved successfully',
  meta: result.meta,
  data: result.data, // already the blog array
});
});


const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const userId = req.user.id;

  const blogData = {
    ...req.body,
    userId,
    eventImgUrl: file?.path, // set image URL
  };

  const result = await BlogService.updateBlogIntoDB(id, blogData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog updated successfully',
    data: result,
  });
});

const getBlogDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await BlogService.getBlogDetailsFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async(req,res) => {
 const { id } = req.params;
  
  const result = await BlogService.deleteBlogFromDB(id);
  if(result){
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog Deleted successfully',
      data: null,
    });
  }
})

export const BlogController = {
    createBlog,
    getBlogs,
    updateBlog,
    getBlogDetails,
    deleteBlog
}