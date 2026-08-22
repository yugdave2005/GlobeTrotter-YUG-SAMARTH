-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('SIGHTSEEING', 'FOOD', 'ADVENTURE', 'RELAXATION');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRANSPORT', 'STAY', 'MEALS', 'MISC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT NOT NULL,
    "photo_url" TEXT,
    "language_preference" TEXT NOT NULL DEFAULT 'en',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "google_id" TEXT,
    "reset_otp" TEXT,
    "reset_otp_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_destinations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "cost_index" DOUBLE PRECISION NOT NULL,
    "popularity_score" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "cover_photo_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_stops" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "arrival_date" TIMESTAMP(3) NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_expenses" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "trip_stop_id" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "trip_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stop_activities" (
    "id" TEXT NOT NULL,
    "trip_stop_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "scheduled_time" TIMESTAMP(3),
    "custom_cost" DOUBLE PRECISION,

    CONSTRAINT "stop_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "trips_share_slug_key" ON "trips"("share_slug");

-- AddForeignKey
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_destinations" ADD CONSTRAINT "saved_destinations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_expenses" ADD CONSTRAINT "trip_expenses_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stop_activities" ADD CONSTRAINT "stop_activities_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stop_activities" ADD CONSTRAINT "stop_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
