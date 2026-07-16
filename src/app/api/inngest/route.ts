import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { dailyFicaReminder, weeklyPopiaComplianceAudit } from "@/lib/inngest-functions";

// Create and export the Next.js API route handler to serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyFicaReminder,
    weeklyPopiaComplianceAudit
  ],
});
