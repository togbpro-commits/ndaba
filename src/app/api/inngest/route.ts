import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { dailyFicaReminder, weeklyPopiaComplianceAudit } from "@/lib/inngest-functions";

// Bypass signature verification during local development by clearing the signing key from memory
if (process.env.NODE_ENV === "development") {
  delete process.env.INNGEST_SIGNING_KEY;
}

// Create and export the Next.js API route handler to serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyFicaReminder,
    weeklyPopiaComplianceAudit
  ],
});
