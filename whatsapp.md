# WhatsApp Business Chatbot CRM Integration Guide

This document outlines the step-by-step production setup and local testing guidelines for integrating a secure **WhatsApp Business Chatbot** connected directly to the Ndabas Attorneys CRM (Supabase + Next.js).

---

## 1. Core Integration Architecture

```
                                  [Meta Developer Console]
                                             │  (WhatsApp Cloud API)
                                             ▼
[Client Phone] ──(WhatsApp Message)──► [WhatsApp Servers]
                                             │  (Secure JSON Webhook)
                                             ▼
                                  [Next.js API Webhook] (/api/whatsapp/webhook)
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
          [Supabase Postgres Database]                 [Inngest Job Queue]
          (Query Case Status & Access Key)             (Download & Upload Media to Storage)
```

---

## 2. Meta WhatsApp Business API Configuration & Local Testing

The **WhatsApp Business Cloud API** allows your application to programmatically receive, parse, and transmit messages using your actual phone number.

### Step 2.1: Meta App Setup
1. Register as a developer on the [Meta Developer Portal](https://developers.facebook.com/).
2. Click **Create App**, select **Other**, and choose **Business** as the app type.
3. Add **WhatsApp** as a product to your app.
4. Select your **WhatsApp Business Account** (connected to your active WhatsApp Business Number). Meta will provide you with a **Phone Number ID** and a **WhatsApp Business Account ID** which you must save inside your secure `.env` file:
   ```env
   WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
   WHATSAPP_ACCESS_TOKEN="your_meta_permanent_system_user_token"
   WHATSAPP_VERIFY_TOKEN="ndaba_secure_webhook_verification_token_2026"
   ```

### Step 2.2: Local Tunneling (ngrok) for Handshake Testing
Meta requires your webhook URL to be fully secured over HTTPS and accessible online. During development, you can tunnel your local Next.js dev server (`http://localhost:3000`) using `ngrok` or our built-in `proxy.ts`:
1. Run the local proxy tunnel to obtain a public HTTPS URL (e.g. `https://ndaba-proxy.ngrok-free.app`).
2. Configure your Webhook URL in Meta as: `https://ndaba-proxy.ngrok-free.app/api/whatsapp/webhook`.
3. Set your Token in Meta to your `WHATSAPP_VERIFY_TOKEN` value.

---

## 3. Webhook Route Implementation in Next.js App Router

Create a new API route at `src/app/api/whatsapp/webhook/route.ts` to handle Meta's requests.

### Part A: Verification Handshake (GET request)
When you add the webhook URL in Meta, Meta sends a GET request to verify ownership of the server. Handle this handshake instantly:
```typescript
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Verification failed', { status: 403 });
}
```

### Part B: Incoming Message Processor (POST request)
When a client sends a message, Meta forwards a JSON payload to our POST handler:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Extract metadata and message body
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!message) {
      return NextResponse.json({ received: true });
    }

    const clientPhone = message.from; // Sender phone (e.g., "27824906285")
    const clientName = contact?.profile?.name || "Client";
    
    // Process message content
    if (message.type === 'text') {
      const incomingText = message.text.body.trim().toLowerCase();
      await handleTextMessage(clientPhone, clientName, incomingText);
    } else if (message.type === 'image') {
      const mediaId = message.image.id;
      const caption = message.image.caption; // e.g. "Deed of sale" or "ID"
      await handleMediaUpload(clientPhone, clientName, mediaId, caption);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook payload processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## 4. Bot Interaction Flow (Dialog State Control)

When `handleTextMessage` is triggered, execute the chatbot dialog flow:

### Flow 1: Greeting & Initial Prompt
If they type `"hi"`, `"hello"`, or `"status"`, the bot responds:
> *"Hello, ${clientName}! Welcome to the Ndabas Attorneys Secure Assistant.* ⚖️
>
> *I am here to assist you at Justice House. Please reply with:*
> *1️⃣ To check your active **Matter / Case Status**.*
> *2️⃣ To check outstanding **FICA Document Verification requirements**.*
> *3️⃣ To speak directly to Advocate Ndaba's receptionist."*

### Flow 2: Case Tracker Query
If they type `"1"` or `"matter"`, the bot prompts:
> *"Please type and enter your **Case ID** (e.g., case-1) or your **Matter Number** (e.g., NDB-2026-1001) to query your live file."*

When they reply with their Case ID or Matter Number:
1. The webhook queries our unified database module:
   ```typescript
   const casesList = await db.getCases();
   const match = casesList.find(c => 
     c.case_number?.toLowerCase() === incomingText ||
     c.id.toLowerCase() === incomingText
   );
   ```
2. If matched:
   > *"💼 **Matter Name:** ${match.case_title}*
   > *📈 **Current Status:** ${match.status}*
   > *📅 **Next Milestone Key Date:** ${match.key_dates}*
   > 
   > *📄 **FICA File Verification:** ${match.documents?.filter(d => d.status === 'Approved').length} out of ${match.documents?.length} documents verified."*
3. If not matched, query using their phone number:
   ```typescript
   const matchPhone = casesList.filter(c => c.client_phone?.replace(/\s+/g, '') === clientPhone);
   ```

### Flow 3: FICA Image Uploading
If they send an **Image** (such as a picture of their ID or rates account bill):
1. Retrieve the media stream from the WhatsApp Business Media Endpoint using the `mediaId`.
2. Upload it to our secure Supabase CRM Storage buckets.
3. Append the file to their active Case Matter documents list inside `public.cases`.
4. Log the action in our real-time **POPIA Compliance Audit Log** as `'Uploaded'` under the operator `'WhatsApp Bot'`.
5. The bot replies:
   > *"📄 **FICA document received!** I have uploaded '${fileName}' securely to your matter file. Our Pretoria conveyancers and advocates will verify its certification status shortly. Thank you!"*

---

## 5. Local Sandbox Testing Workflow

Using your **active WhatsApp Business Number**, you can test this in under 30 minutes:
1. **Developer Registration (5 Mins):** Register your number inside Meta's WhatsApp Developer dashboard to acquire sandbox credentials.
2. **Launch Proxy Tunnels (5 Mins):** Start your Next.js project and standard `proxy` tunnel locally.
3. **Webhook Link & Handshake (5 Mins):** Input your public tunnel URL in the Meta console. Meta will query our `GET` handshake route and confirm verification instantly.
4. **Interactive Sandbox Testing (15 Mins):** Text your number from your personal WhatsApp chat and view the chatbot's dynamic database query responses, rescheduling requests, and file uploads updating your Admin Dashboard in real-time!
