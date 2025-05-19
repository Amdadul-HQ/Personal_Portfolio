import { Skill } from "@prisma/client"
import prisma from "../../app/shared/prisma"

const createSkill = async(payload:Skill,userId:string) => {
    const result = await prisma.skill.create({
        data:{...payload,userId}
    })

    return result;
}

const getAllSkills = async() => {
 
    const result = await prisma.skill.findMany()
    return result
}

const getSkillsDetails = async(id:string) => {
  const result = await prisma.skill.findUnique({
    where:{
      id
    }
  });
  return result
}

const updateSkillIntoDB =async(id:string,data:Partial<Skill>,) => {
    await prisma.skill.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.skill.update({
    where: { id },
    data,
  });
  return result;
}

const deleteSkillFromDB = async(id:string) => {
 const result = await prisma.skill.delete({
    where:{
      id
    }
  })
  return result
}


export const SkillsService = {
    createSkill,
    getAllSkills,
    updateSkillIntoDB,
    deleteSkillFromDB,
    getSkillsDetails
}