'use server';

import { Resend } from 'resend';

// Initialize Resend with key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailPayload {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  matterType: string;
  matterDescription: string;
  bookingDate: string;
  bookingTime: string;
  caseNumber?: string;
  accessKey?: string;
}

export async function sendOnboardingEmails(data: EmailPayload) {
  console.log('Server Action: Sending onboarding emails for', data.name);

  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Consultation Secured - Ndabas Attorneys</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #FBFBFA;
            color: #1F1F1E;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border: 1px solid #EAEAE8;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }
          .header {
            background-color: #111110;
            color: #FFFFFF;
            padding: 48px 40px;
            text-align: center;
          }
          .logo {
            font-family: Georgia, serif;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.15em;
            color: #FFFFFF;
            text-transform: uppercase;
            margin-bottom: 24px;
          }
          .logo span {
            color: #B76E79; /* Rose Gold Accent */
          }
          .badge {
            display: inline-block;
            font-family: monospace;
            font-size: 10px;
            letter-spacing: 0.2em;
            color: #B76E79;
            text-transform: uppercase;
            border: 1px solid rgba(183, 110, 121, 0.3);
            padding: 6px 16px;
            border-radius: 100px;
            margin-bottom: 16px;
          }
          .title {
            font-family: Georgia, serif;
            font-size: 28px;
            line-height: 1.3;
            font-weight: normal;
            margin: 0;
          }
          .content {
            padding: 40px;
          }
          .intro {
            font-size: 14px;
            line-height: 1.6;
            color: #5C5C59;
            margin-top: 0;
            margin-bottom: 32px;
          }
          .card {
            background-color: #F8F8F6;
            border: 1px solid #EAEAE8;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .card-title {
            font-family: monospace;
            font-size: 10px;
            letter-spacing: 0.15em;
            color: #B76E79;
            text-transform: uppercase;
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 16px;
            border-bottom: 1px solid #EAEAE8;
            padding-bottom: 8px;
          }
          .detail-row {
            margin-bottom: 12px;
            font-size: 13px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            color: #8C8C88;
            font-weight: bold;
            text-transform: uppercase;
            font-family: monospace;
            font-size: 10px;
            letter-spacing: 0.05em;
            display: inline-block;
            width: 140px;
          }
          .detail-value {
            color: #1F1F1E;
            font-weight: 500;
            display: inline-block;
          }
          .highlight {
            color: #B76E79;
            font-weight: bold;
          }
          .footer {
            background-color: #F8F8F6;
            border-top: 1px solid #EAEAE8;
            padding: 32px 40px;
            font-size: 11px;
            line-height: 1.6;
            color: #8C8C88;
          }
          .footer-logo {
            font-family: Georgia, serif;
            font-weight: bold;
            font-size: 14px;
            color: #1F1F1E;
            margin-bottom: 8px;
          }
          .footer-text {
            margin-bottom: 16px;
          }
          .footer-compliance {
            font-size: 10px;
            border-top: 1px solid #EAEAE8;
            padding-top: 16px;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">NDABAS <span>ATTORNEYS</span></div>
            <div class="badge">SECURED CONSULTATION</div>
            <h1 class="title">Your Legal Onboarding is Complete</h1>
          </div>
          <div class="content">
            <p class="intro">
              Dear <strong>${data.name}</strong>,<br><br>
              Thank you for completing your digital FICA onboarding portal. Your legal profile and FICA files have been securely logged in our system. A matter has been successfully opened under <strong>Awaiting Documents</strong> status.
            </p>
            
            <div class="card">
              <div class="card-title">APPOINTMENT SUMMARY</div>
              <div class="detail-row">
                <span class="detail-label">MATTER TYPE:</span>
                <span class="detail-value highlight">${data.matterType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">DATE SECURED:</span>
                <span class="detail-value">${data.bookingDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">TIME SLOT:</span>
                <span class="detail-value font-mono">${data.bookingTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">VENUE:</span>
                <span class="detail-value font-bold">Justice House, Hammanskraal</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ADDRESS:</span>
                <span class="detail-value">2208C Block AA Portion 9, Hammanskraal</span>
              </div>
            </div>

            <div class="card" style="border: 1px solid rgba(183, 110, 121, 0.4); background-color: #FAF6F7;">
              <div class="card-title" style="color: #B76E79;">SECURE CLIENT TRACKING CREDENTIALS</div>
              <div class="detail-row">
                <span class="detail-label">CASE NUMBER:</span>
                <span class="detail-value font-mono font-bold highlight" style="font-size: 14px;">${data.caseNumber || 'Generating...'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">SECRET ACCESS KEY:</span>
                <span class="detail-value font-mono font-bold" style="font-size: 14px; background-color: #111110; color: #FFFFFF; padding: 4px 10px; border-radius: 6px;">${data.accessKey || 'Generating...'}</span>
              </div>
              <div style="font-size: 10px; color: #8C8C88; margin-top: 12px; font-family: sans-serif; line-height: 1.4;">
                <strong>Tracking Notice:</strong> Use these credentials on our online portal or text them to our WhatsApp support bot to track your case status, view document reviews, or upload supplementary files. Do not share your Secret Access Key.
              </div>
            </div>

            <div class="card">
              <div class="card-title">FICA VERIFICATION BRIEF</div>
              <div class="detail-row">
                <span class="detail-label">CLIENT NAME:</span>
                <span class="detail-value">${data.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ID NUMBER:</span>
                <span class="detail-value font-mono">${data.idNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">CONTACT PHONE:</span>
                <span class="detail-value font-mono">${data.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PHYSICAL ADDRESS:</span>
                <span class="detail-value">${data.address}</span>
              </div>
            </div>

            <p class="intro" style="font-size: 13px; text-align: center;">
              <em>Please ensure you bring your original hard-copy FICA documents (ID book/card, proof of residence) to your consultation at Justice House.</em>
            </p>
          </div>
          <div class="footer">
            <div class="footer-logo">NDABA&apos;S ATTORNEYS</div>
            <div class="footer-text">
              Justice House, 2208C Block AA Portion 9, Hammanskraal, Pretoria, 0400<br>
              Tel: 012 711 0427 | Cell: 082 490 6285 | Email: info@ndabasattorneys.co.za
            </div>
            <div class="footer-compliance">
              <strong>POPIA & LPC Compliance Notice:</strong><br>
              This electronic communication is subject to the Protection of Personal Information Act (POPIA) of South Africa. Your uploaded FICA files and identity details are encrypted and processed strictly in connection with legal matters. Ndabas Attorneys is fully registered with the Legal Practice Council (LPC) of South Africa.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const staffHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Self-Onboarded Client - Ndabas Attorneys</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #FBFBFA;
            color: #1F1F1E;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border: 1px solid #EAEAE8;
            border-radius: 24px;
            overflow: hidden;
          }
          .header {
            background-color: #B76E79; /* Rose Gold Accent */
            color: #FFFFFF;
            padding: 32px;
            text-align: center;
          }
          .title {
            font-family: Georgia, serif;
            font-size: 22px;
            margin: 0;
            font-weight: normal;
          }
          .content {
            padding: 40px;
          }
          .card {
            background-color: #F8F8F6;
            border: 1px solid #EAEAE8;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .card-title {
            font-family: monospace;
            font-size: 10px;
            letter-spacing: 0.15em;
            color: #B76E79;
            text-transform: uppercase;
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 16px;
            border-bottom: 1px solid #EAEAE8;
            padding-bottom: 8px;
          }
          .detail-row {
            margin-bottom: 12px;
            font-size: 13px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            color: #8C8C88;
            font-weight: bold;
            text-transform: uppercase;
            font-family: monospace;
            font-size: 10px;
            display: inline-block;
            width: 140px;
          }
          .detail-value {
            color: #1F1F1E;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">New Client Onboarded (FICA Secured)</h1>
          </div>
          <div class="content">
            <p>A new client has completed self-onboarding and booked a consultation at Justice House via the digital portal.</p>
            
            <div class="card">
              <div class="card-title">CLIENT DETAILS</div>
              <div class="detail-row">
                <span class="detail-label">NAME:</span>
                <span class="detail-value font-bold">${data.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ID / PASSPORT:</span>
                <span class="detail-value font-mono">${data.idNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PHONE:</span>
                <span class="detail-value font-mono">${data.phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">EMAIL:</span>
                <span class="detail-value font-mono">${data.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ADDRESS:</span>
                <span class="detail-value">${data.address}</span>
              </div>
            </div>

            <div class="card">
              <div class="card-title">CASE TRACKING INFO</div>
              <div class="detail-row">
                <span class="detail-label">CASE NUMBER:</span>
                <span class="detail-value font-bold font-mono text-primary" style="color: #B76E79;">${data.caseNumber || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">SECRET ACCESS KEY:</span>
                <span class="detail-value font-mono font-bold">${data.accessKey || 'N/A'}</span>
              </div>
            </div>

            <div class="card">
              <div class="card-title">MATTER BRIEF</div>
              <div class="detail-row">
                <span class="detail-label">SERVICE TYPE:</span>
                <span class="detail-value font-bold" style="color: #B76E79;">${data.matterType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">DESCRIPTION:</span>
                <span class="detail-value" style="display: block; margin-top: 4px; color: #5C5C59;">${data.matterDescription}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">MEETING DATE:</span>
                <span class="detail-value font-bold">${data.bookingDate} @ ${data.bookingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.warn('RESEND_API_KEY is not defined in .env. Mock sending emails (logged to server console).');
    return {
      success: true,
      mocked: true,
      message: 'Onboarding emails simulated because RESEND_API_KEY is not configured.'
    };
  }

  // Resend Free Tier Sandboxing Overrider
  // On a free plan, Resend only allows sending to the registered owner (acebany080@gmail.com).
  // We dynamically reroute any other recipient to ensure the email sends successfully and can be verified by the owner.
  const targetEmail = data.email.toLowerCase().includes('acebany080@gmail.com')
    ? data.email
    : 'acebany080@gmail.com';

  const reroutedClientHtml = data.email.toLowerCase().includes('acebany080@gmail.com')
    ? clientHtml
    : clientHtml.replace(
        '<div class="container">',
        `<div class="container">
         <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; padding: 14px 20px; border-radius: 12px; font-size: 11px; font-family: monospace; margin: 20px auto; max-width: 520px; box-sizing: border-box; line-height: 1.5;">
           🚨 <strong>[SANDBOX PLAN NOTICE]</strong><br>
           This email was originally addressed to <strong>${data.email}</strong>, but was rerouted to you (<strong>${targetEmail}</strong>) because your Resend API account is on the free tier. Set up a domain at resend.com to send to other recipients.
         </div>`
      );

  try {
    // Send email to client
    const clientRes = await resend.emails.send({
      from: 'Ndabas Attorneys <onboarding@resend.dev>',
      to: targetEmail,
      subject: 'Consultation Secured & FICA Profile Registered - Ndabas Attorneys',
      html: reroutedClientHtml
    });

    if (clientRes.error) {
      console.error('Resend error sending email to client:', clientRes.error);
    }

    // Send email to staff
    const staffRes = await resend.emails.send({
      from: 'Ndabas Attorneys Portal <onboarding@resend.dev>',
      to: 'acebany080@gmail.com',
      subject: `[NEW CLIENT ONBOARDED] - ${data.name} (${data.matterType})`,
      html: staffHtml
    });

    if (staffRes.error) {
      console.error('Resend error sending email to staff:', staffRes.error);
    }

    return {
      success: true,
      mocked: false,
      clientMessageId: clientRes.data?.id || null,
      staffMessageId: staffRes.data?.id || null
    };
  } catch (err: any) {
    console.error('Failed to send Resend emails:', err);
    return {
      success: false,
      error: err?.message || String(err)
    };
  }
}

export async function sendClientNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  caseNumber: string;
  customHtml?: string;
}) {
  console.log('Server Action: Sending client status notification email for', data.name);
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined in .env. Mock sending client alert.');
    return {
      success: true,
      mocked: true,
      message: 'Status notification simulated successfully.'
    };
  }

  const notificationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${data.subject}</title>
        <style>
          body { font-family: sans-serif; background-color: #FBFBFA; color: #1F1F1E; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #EAEAE8; border-radius: 20px; padding: 40px; }
          .logo { font-family: Georgia, serif; font-size: 18px; font-weight: bold; letter-spacing: 0.15em; color: #111110; text-transform: uppercase; margin-bottom: 24px; border-bottom: 1px solid #EAEAE8; padding-bottom: 16px; }
          .logo span { color: #B76E79; }
          .title { font-family: Georgia, serif; font-size: 20px; font-weight: normal; margin-top: 0; margin-bottom: 16px; color: #111110; }
          .message { font-size: 14px; line-height: 1.6; color: #5C5C59; margin-bottom: 32px; }
          .meta-box { background-color: #F8F8F6; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 11px; color: #8C8C88; margin-bottom: 32px; }
          .footer { font-size: 11px; color: #8C8C88; border-top: 1px solid #EAEAE8; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">NDABAS <span>ATTORNEYS</span></div>
          <h1 class="title">${data.subject}</h1>
          <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
          <div class="meta-box">
            MATTER SYSTEM RECORD REF:<br>
            CASE NUMBER: ${data.caseNumber}
          </div>
          <div class="footer">
            Justice House, 2208C Block AA Portion 9, Hammanskraal, Pretoria, 0400<br>
            Tel: 012 711 0427 | Email: info@ndabasattorneys.co.za
          </div>
        </div>
      </body>
    </html>
  `;

  // Determine actual HTML content to transmit
  const htmlToSend = data.customHtml || notificationHtml;

  // Resend Free Tier Sandboxing Overrider
  // On a free plan, Resend only allows sending to the registered owner (acebany080@gmail.com).
  // We dynamically reroute any other recipient to ensure the email sends successfully and can be verified by the owner.
  const targetEmail = data.email.toLowerCase().includes('acebany080@gmail.com')
    ? data.email
    : 'acebany080@gmail.com';

  const reroutedNotificationHtml = data.email.toLowerCase().includes('acebany080@gmail.com')
    ? htmlToSend
    : htmlToSend.replace(
        '<div class="container">',
        `<div class="container">
         <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; padding: 14px 20px; border-radius: 12px; font-size: 11px; font-family: monospace; margin-bottom: 24px; line-height: 1.5;">
           🚨 <strong>[SANDBOX PLAN NOTICE]</strong><br>
           This notification was originally addressed to <strong>${data.email}</strong>, but was rerouted to you (<strong>${targetEmail}</strong>) because your Resend API account is on the free tier. Set up a domain at resend.com to send to other recipients.
         </div>`
      );

  try {
    const res = await resend.emails.send({
      from: 'Ndabas Attorneys <onboarding@resend.dev>',
      to: targetEmail,
      subject: data.subject,
      html: reroutedNotificationHtml
    });

    if (res.error) {
      console.error('Resend error sending status alert:', res.error);
      return { success: false, error: res.error.message };
    }

    return { success: true, mocked: false, messageId: res.data?.id || null };
  } catch (err: any) {
    console.error('Failed to send status notification:', err);
    return { success: false, error: err?.message || String(err) };
  }
}
