import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";
import { contactSchema } from "@/lib/validations";
import nodemailer from "nodemailer";

/**
 * POST /api/contact
 * Handles new public message submissions, inserting them to Supabase
 * and forwarding email alerts to the owner.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod schema validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // 2. Insert to Supabase contact_messages table
    const supabase = createClientServer();
    if (supabase) {
      const { error: dbError } = await supabase.from("contact_messages").insert([
        {
          name,
          email,
          subject,
          message,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        console.error("Database error saving contact message:", dbError);
        // We continue to email even if database write fails to ensure message delivery
      }
    } else {
      console.warn("Supabase database connection offline. Contact message skipped DB store.");
    }

    // 3. Dispatch Email Alert via SMTP / Resend
    const smtpHost = process.env.SMTP_HOST || "smtp.resend.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "resend";
    const smtpPass = process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY || "";
    const adminEmail = process.env.ADMIN_RECEIVER_EMAIL || "dinethprashansa.517@outlook.com";

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Alerts" <onboarding@resend.dev>`,
          to: adminEmail,
          subject: `[Portfolio Channel] ${subject}: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #111;">
              <h2>New Message Received</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Nodemailer dispatch alert failed:", mailError);
      }
    } else {
      console.warn("SMTP settings are empty. Message only written to DB.");
    }

    return NextResponse.json({ success: true, message: "Payload processed successfully" });
  } catch (error: any) {
    console.error("Contact API internal failure:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while routing payload." },
      { status: 500 }
    );
  }
}
