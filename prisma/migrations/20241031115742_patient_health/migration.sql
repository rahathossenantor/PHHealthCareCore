-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('MARRIED', 'UNMARRIED');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'B_POSITIVE', 'O_POSITIVE', 'AB_POSITIVE', 'A_NEGATIVE', 'B_NEGATIVE', 'O_NEGATIVE', 'AB_NEGATIVE');

-- CreateTable
CREATE TABLE "patient_healths" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "hasAllergies" BOOLEAN NOT NULL,
    "hasDiabetes" BOOLEAN NOT NULL,
    "smokingStatus" BOOLEAN NOT NULL,
    "pregnancyStatus" BOOLEAN NOT NULL,
    "hasPastSurgeries" BOOLEAN NOT NULL,
    "recentAnxiety" BOOLEAN NOT NULL,
    "recentDepression" BOOLEAN NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "dietaryPreferences" TEXT NOT NULL,
    "mentalHealthHistory" TEXT NOT NULL,
    "immunizationStatus" TEXT NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_healths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_reports" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_healths_patientId_key" ON "patient_healths"("patientId");

-- AddForeignKey
ALTER TABLE "patient_healths" ADD CONSTRAINT "patient_healths_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
