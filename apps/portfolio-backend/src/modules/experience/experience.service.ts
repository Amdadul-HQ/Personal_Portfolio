import { Experience } from "@prisma/client"
import prisma from "../../app/shared/prisma"

const createExperience = async (payload:Experience,userId:string) => {
    const result = await prisma.experience.create({
        data: {
            ...payload,
            userId
        }
    })

    return result
}

const getExperienceDetails = async(id:string) => {
  const result = await prisma.experience.findUnique({
    where:{
      id
    }
  })
  return result;
}

const getAllExperience = async () => {
    const result = await prisma.experience.findMany()

    return result
}

const updateExperience = async(id:string,data:Partial<Experience>) => {
 await prisma.experience.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.experience.update({
    where: { id },
    data,
  });
  return result;
}

const deleteExperience = async(id:string) => {
   const result = await prisma.experience.delete({
    where:{
      id
    }
  })
  return result
}

export const ExperienceService =  {
    createExperience,
    getAllExperience,
    updateExperience,
    deleteExperience,
    getExperienceDetails
}