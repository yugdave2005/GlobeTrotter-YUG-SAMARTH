-- CreateTable
CREATE TABLE "travel_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interests" TEXT[],
    "travel_style" TEXT NOT NULL,
    "travel_pace" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "companions" TEXT NOT NULL,
    "priorities" TEXT[],

    CONSTRAINT "travel_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "travel_preferences_user_id_key" ON "travel_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "travel_preferences" ADD CONSTRAINT "travel_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
