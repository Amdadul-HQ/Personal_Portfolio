import { Prisma, Project } from "@prisma/client"
import prisma from "../../app/shared/prisma";
import { paginationHelper } from "../../app/helper/paginationHelper";
import { IPaginationOptions } from "../../app/interface/pagination";
import { projectSearchableFields } from "./projects.constant";
import { IProjectFilterRequest } from "./project.interface";

const createProjectInToDB = async(payload:Project,userId:string) => {
    const result = await prisma.project.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
}

const getAllProjectFromDB =  async (filters: IProjectFilterRequest,
  options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  // Search term filter
  if (searchTerm) {
    andConditions.push({
      OR: projectSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Other filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProjectWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch all events
  const allProjects = await prisma.project.findMany({
    where: whereConditions,
    include: {
      user: true,
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            projectStartDate: 'desc',
          },
  });

  // Paginate the allEvents list
  const paginatedData = allProjects.slice(skip, skip + limit);

  return {
    meta: {
      page,
      limit,
      total: allProjects.length,
    },
    data: {
      paginatedData,
    },
  };
}

const getProjectDetailsFromDB = async (id:string) => {
 const result = await prisma.project.findUniqueOrThrow({
    where:{
      id
    }
  })

  return result;
}

const updateProjectInToDB = async(id:string,data:Partial<Project>,) => {
await prisma.project.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.project.update({
    where: { id },
    data,
  });
  return result;
}

const deleteProjectFromDB = async(id:string) => {
 const result = await prisma.project.delete({
    where:{
      id
    }
  })
  return result
}

export const ProjectService = {
    createProjectInToDB,
    getAllProjectFromDB,
    getProjectDetailsFromDB,
    updateProjectInToDB,
    deleteProjectFromDB
}