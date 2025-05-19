-- CreateEnum
CREATE TYPE "FIELDTYPE" AS ENUM ('FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "USER" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BLOG" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "readingTime" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT[],

    CONSTRAINT "BLOG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PROJECT" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "liveLink" TEXT NOT NULL,
    "gitHubLink" TEXT NOT NULL,
    "siteMockup" TEXT NOT NULL,
    "projectStartDate" TIMESTAMP(3) NOT NULL,
    "projectEndDate" TIMESTAMP(3) NOT NULL,
    "elements" INTEGER NOT NULL,
    "totalCode" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "services" TEXT[],
    "techonology" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PROJECT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EXPERIENCE" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "companyImage" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skill" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EXPERIENCE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SKILL" (
    "id" TEXT NOT NULL,
    "field" "FIELDTYPE" NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "SKILL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "USER"("email");
