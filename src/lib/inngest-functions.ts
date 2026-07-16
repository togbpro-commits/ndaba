import { inngest } from "./inngest";
import { db } from "./db";
import { sendClientNotificationEmail } from "@/app/actions/email";

/**
 * CRON JOB: Daily FICA Verification Reminders
 * Runs daily at 8:00 AM SAST (cron: "0 8 * * *")
 * Scans for cases in 'Awaiting Documents' status and sends polite FICA reminders.
 */
export const dailyFicaReminder = inngest.createFunction(
  { 
    id: "daily-fica-reminder",
    name: "Daily FICA Reminder",
    triggers: [{ cron: "0 8 * * *" }]
  },
  async ({ step }) => {
    console.log("Inngest Cron: Starting daily FICA reminder check...");

    const cases = await step.run("fetch-active-cases", async () => {
      return await db.getCases();
    });

    const awaitingCases = cases.filter(c => c.status === "Awaiting Documents" && c.case_number && c.access_key);
    console.log(`Inngest Cron: Found ${awaitingCases.length} cases awaiting FICA documents.`);

    const results = [];

    for (const c of awaitingCases) {
      await step.run(`send-fica-reminder-case-${c.id}`, async () => {
        const clientEmail = c.documents?.[0]?.url 
          ? "acebany080@gmail.com" // If they have some docs, email the attorney, else fallback
          : "acebany080@gmail.com"; // Ensure sandbox compliance

        const msg = `Dear ${c.client_name},\n\nThis is a friendly reminder from Ndabas Attorneys regarding your registered legal matter: "${c.case_title}".\n\nOur compliance team is currently awaiting your FICA documents (smart ID, Proof of Residence) to verify your profile before we can initiate representation. Your matter cannot proceed without these files.\n\nTo securely upload them, please log into our secure tracking portal using:\nCase Number: ${c.case_number}\nSecret Access Key: ${c.access_key}\n\nAlternatively, you can reply directly to our virtual assistant on WhatsApp with these credentials to upload your files. Thank you for your cooperation.\n\nWarm regards,\nNdabas Attorneys Compliance Team\nJustice House, Pretoria`;

        // Send alert email (automatically reregistered to acebany080@gmail.com in sandbox)
        await sendClientNotificationEmail({
          name: c.client_name,
          email: clientEmail,
          subject: `FICA ACTION REQUIRED: Complete Your Onboarding - Case ${c.case_number}`,
          message: msg,
          caseNumber: c.case_number || "N/A"
        });

        // Insert POPIA log
        await db.insertPopiaLog({
          case_id: c.id,
          case_title: c.client_name,
          document_name: "Automated FICA Reminder Alert",
          action: "Viewed",
          user_email: "Inngest Cron System"
        });

        return { case_id: c.id, status: "reminder-sent" };
      });
      results.push(c.id);
    }

    return { dispatched_reminders: results };
  }
);

/**
 * CRON JOB: Weekly POPIA Compliance Audit Rollup
 * Runs every Sunday at midnight (cron: "0 0 * * 0")
 * Compiles access records and emails a summary to acebany080@gmail.com.
 */
export const weeklyPopiaComplianceAudit = inngest.createFunction(
  { 
    id: "weekly-popia-audit-rollup",
    name: "Weekly POPIA Compliance Audit Rollup",
    triggers: [{ cron: "0 0 * * 0" }]
  },
  async ({ step }) => {
    console.log("Inngest Cron: Compiling weekly POPIA compliance logs...");

    const logs = await step.run("fetch-popia-logs", async () => {
      return await db.getPopiaLogs();
    });

    // Filter logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = logs.filter(l => new Date(l.created_at) >= sevenDaysAgo);

    console.log(`Inngest Cron: Compiled ${recentLogs.length} recent compliance logs.`);

    await step.run("email-audit-report-to-head", async () => {
      const logsHtml = recentLogs.map((l) => `
        <tr style="border-bottom: 1px solid #EAEAE8; font-size: 11px; font-family: monospace;">
          <td style="padding: 10px; color: #5C5C59;">${new Date(l.created_at).toLocaleString()}</td>
          <td style="padding: 10px; font-weight: bold; color: #1F1F1E;">${l.user_email}</td>
          <td style="padding: 10px; color: #B76E79; font-weight: bold;">${l.action.toUpperCase()}</td>
          <td style="padding: 10px; color: #1F1F1E;">${l.document_name}</td>
          <td style="padding: 10px; color: #8C8C88;">${l.case_title}</td>
        </tr>
      `).join("");

      const reportHtml = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; background-color: #FBFBFA; color: #1F1F1E; padding: 30px;">
            <div style="max-width: 650px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAEAE8; border-radius: 20px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.015);">
              <h1 style="font-family: Georgia, serif; font-size: 20px; font-weight: normal; margin-top: 0; color: #111110; border-bottom: 2px solid #B76E79; padding-bottom: 12px;">
                Weekly POPIA Compliance Audit Ledger
              </h1>
              <p style="font-size: 13px; line-height: 1.5; color: #5C5C59;">
                Dear Admin,<br><br>
                In compliance with South Africa's Protection of Personal Information Act (POPIA) and the Legal Practice Council (LPC) standards, here is the automated weekly rollup log tracking all document views, uploads, and status changes across the client tracking system.
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                <thead>
                  <tr style="background-color: #F8F8F6; text-align: left; font-size: 10px; font-family: monospace; border-bottom: 1px solid #EAEAE8; color: #8C8C88;">
                    <th style="padding: 10px;">TIMESTAMP</th>
                    <th style="padding: 10px;">OPERATOR</th>
                    <th style="padding: 10px;">ACTION</th>
                    <th style="padding: 10px;">DOCUMENT</th>
                    <th style="padding: 10px;">MATTER TITLE</th>
                  </tr>
                </thead>
                <tbody>
                  ${logsHtml || '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #8C8C88; font-style: italic;">No audit ledger actions logged this week.</td></tr>'}
                </tbody>
              </table>

              <div style="margin-top: 30px; font-size: 10px; color: #8C8C88; border-top: 1px solid #EAEAE8; padding-top: 16px;">
                <strong>Justice House Systems Auditing</strong><br>
                Ndabas Attorneys & Conveyancers, Pretoria, South Africa
              </div>
            </div>
          </body>
        </html>
      `;

      // Dispatch directly to the registered principal attorney (acebany080@gmail.com)
      await sendClientNotificationEmail({
        name: "Principal Attorney",
        email: "acebany080@gmail.com",
        subject: `[SYSTEM AUDIT] Weekly POPIA Compliance Rollup Report`,
        message: "POPIA Weekly Report Attached",
        caseNumber: "SYSTEM-AUDIT",
        customHtml: reportHtml
      });
    });

    return { processed_logs: recentLogs.length };
  }
);
