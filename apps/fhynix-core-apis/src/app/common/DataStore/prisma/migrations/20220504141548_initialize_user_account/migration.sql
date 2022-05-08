-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at_utc" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "login_method" TEXT NOT NULL,
    "first_login_at_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at_utc" TIMESTAMP(3) NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at_utc" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "account_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "timezone_offset_in_mins" INTEGER,
    "is_onboarding_completed" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMembers" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at_utc" TIMESTAMP(3),
    "updated_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "relationship_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "dob" TIMESTAMP(3),
    "profile_image" TEXT,
    "gender" TEXT,
    "other_info" TEXT,
    "color" TEXT,
    "personalities" TEXT,
    "interests" TEXT,

    CONSTRAINT "FamilyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipsMaster" (
    "id" TEXT NOT NULL,
    "created_at_utc" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at_utc" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "relation" TEXT NOT NULL,
    "relation_type" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL,

    CONSTRAINT "RelationshipsMaster_pkey" PRIMARY KEY ("id")
);
