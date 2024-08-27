-- DropForeignKey
ALTER TABLE "goal_checklist" DROP CONSTRAINT "goal_checklist_goalId_fkey";

-- AddForeignKey
ALTER TABLE "goal_checklist" ADD CONSTRAINT "goal_checklist_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
