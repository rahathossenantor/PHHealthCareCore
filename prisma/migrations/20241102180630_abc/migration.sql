-- AlterTable
ALTER TABLE "patient_healths" ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "hasDiabetes" SET DEFAULT false,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
ALTER COLUMN "mentalHealthHistory" DROP NOT NULL,
ALTER COLUMN "immunizationStatus" DROP NOT NULL,
ALTER COLUMN "maritalStatus" SET DEFAULT 'UNMARRIED';
