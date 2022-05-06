-- AlterTable
ALTER TABLE "FamilyMembers" ALTER COLUMN "is_deleted" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "relationship_id" DROP NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RelationshipsMaster" ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "updated_by" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Habits" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at_utc" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "applies_for_relations" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL,

    CONSTRAINT "Habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMemberHabits" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at_utc" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "family_member_id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "applies_for_relations" TEXT NOT NULL,

    CONSTRAINT "FamilyMemberHabits_pkey" PRIMARY KEY ("id")
);
