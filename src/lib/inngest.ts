import { Inngest } from "inngest";

// Create an Inngest client to send and receive events
export const inngest = new Inngest({ 
  id: "ndabas-attorneys-crm",
  name: "Ndabas Attorneys Legal CRM",
  signingKey: process.env.NODE_ENV === "development" ? "" : process.env.INNGEST_SIGNING_KEY
});
