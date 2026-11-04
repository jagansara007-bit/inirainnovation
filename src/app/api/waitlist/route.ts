import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { email?: string } | null;
    const email = body?.email?.trim().toLowerCase() ?? "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 });
    }

    let registrationOrder: number | string | null = null;
    let isAlreadyRegistered = false;

    // 1. Store in Supabase database
    if (supabase) {
      try {
        const { data: existing, error: checkError } = await supabase
          .from("waitlist")
          .select("id, created_at")
          .eq("email", email)
          .maybeSingle();

        if (checkError) {
          console.warn("[Waitlist DB Warning]:", checkError.message);
        }

        if (existing) {
          isAlreadyRegistered = true;
          registrationOrder = existing.id;
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from("waitlist")
            .insert({ email, email_sent: false })
            .select("id, created_at")
            .single();

          if (insertError) {
            console.error("[Waitlist DB Error]:", insertError.message);
          } else if (inserted) {
            registrationOrder = inserted.id;
          }
        }
      } catch (dbErr) {
        console.error("[Waitlist DB Exception]:", dbErr);
      }
    }

    // 2. Setup Nodemailer and dispatch email
    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || "inirainnovations@gmail.com";
    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

    let emailSentSuccessfully = false;

    if (emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        const spotBadge = registrationOrder
          ? `Priority Access &bull; Spot #${registrationOrder}`
          : `Priority Access Reserved`;

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Inira Innovations</title>
</head>
<body style="margin: 0; padding: 0; background-color: #241f1c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f0e8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #241f1c; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #2d2a26; border-radius: 16px; border: 1px solid rgba(245, 240, 232, 0.1); overflow: hidden; padding: 40px 32px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);">
          
          <!-- Header / Brand -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <span style="font-size: 13px; letter-spacing: 0.26em; text-transform: uppercase; color: #c97a3d; font-weight: 600;">INIRA INNOVATIONS</span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="height: 1px; width: 48px; background-color: #c97a3d;"></div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 30px; font-weight: 500; color: #f5f0e8; letter-spacing: -0.02em; line-height: 1.25;">
                You're on the list.
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding-bottom: 24px; line-height: 1.7; font-size: 15px; color: rgba(245, 240, 232, 0.85); text-align: center;">
              <p style="margin: 0 0 16px;">
                Thank you for your interest in <strong>Inira Innovations</strong>. We have registered your email address (<strong>${email}</strong>) to our official waitlist.
              </p>
              <p style="margin: 0;">
                As we prepare for our launch, you will be among the first to receive private previews, product announcements, and early access opportunities.
              </p>
            </td>
          </tr>

          <!-- Status Badge with Registration Order -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="display: inline-block; padding: 10px 22px; background-color: rgba(201, 122, 61, 0.12); border: 1px solid rgba(201, 122, 61, 0.3); border-radius: 9999px;">
                <span style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #c97a3d; font-weight: 600;">
                  ${spotBadge}
                </span>
              </div>
            </td>
          </tr>

          <!-- Social Media Section -->
          <tr>
            <td style="padding-bottom: 36px; text-align: center; border-top: 1px solid rgba(245, 240, 232, 0.08); padding-top: 28px;">
              <p style="margin: 0 0 16px; font-size: 14px; color: rgba(245, 240, 232, 0.8);">
                While waiting, please check out our social media platforms:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 4px 8px;">
                    <a href="https://instagram.com/inira_innovations" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: rgba(245, 240, 232, 0.05); border: 1px solid rgba(245, 240, 232, 0.15); border-radius: 9999px; color: #f5f0e8; text-decoration: none; font-size: 13px; font-weight: 500;">
                      <span style="color: #c97a3d; margin-right: 6px;">&#9679;</span> Instagram <span style="color: rgba(245, 240, 232, 0.5); font-size: 12px;">@inira_innovations</span>
                    </a>
                  </td>
                  <td style="padding: 4px 8px;">
                    <a href="https://linkedin.com/company/inira-innovations" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: rgba(245, 240, 232, 0.05); border: 1px solid rgba(245, 240, 232, 0.15); border-radius: 9999px; color: #f5f0e8; text-decoration: none; font-size: 13px; font-weight: 500;">
                      <span style="color: #c97a3d; margin-right: 6px;">&#9679;</span> LinkedIn
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid rgba(245, 240, 232, 0.08); padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: rgba(245, 240, 232, 0.45); line-height: 1.6;">
                Inira Innovations &bull; <a href="mailto:inirainnovations@gmail.com" style="color: #c97a3d; text-decoration: none;">inirainnovations@gmail.com</a>
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: rgba(245, 240, 232, 0.3);">
                If you did not make this request, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

        await transporter.sendMail({
          from: `"Inira Innovations" <${emailUser}>`,
          to: email,
          replyTo: emailUser,
          subject: "Welcome to Inira Innovations — You're on the list",
          text: `Welcome to Inira Innovations\n\nThank you for joining our waitlist (${email}). We have confirmed your registration.${
            registrationOrder ? ` You are #${registrationOrder} on the waitlist.` : ""
          }\n\nAs we prepare for our launch, you will be among the first to receive private previews and early access updates.\n\nWhile waiting, please check out our social media platforms:\n• Instagram: https://instagram.com/inira_innovations (@inira_innovations)\n• LinkedIn: https://linkedin.com/company/inira-innovations\n\nWarm regards,\nInira Innovations\ninirainnovations@gmail.com`,
          html: htmlContent,
        });

        emailSentSuccessfully = true;

        if (supabase && registrationOrder) {
          await supabase
            .from("waitlist")
            .update({ email_sent: true })
            .eq("id", registrationOrder);
        }
      } catch (mailErr) {
        console.error("[Waitlist Email Error]:", mailErr);
      }
    } else {
      console.warn("⚠️ [Waitlist] EMAIL_PASS is not set. Skipping email dispatch.");
    }

    // Always succeed if the registration was processed or captured
    return NextResponse.json({
      ok: true,
      message: isAlreadyRegistered
        ? "You are already on the waitlist! We have verified your spot."
        : "You are on the waitlist!",
      order: registrationOrder,
      emailSent: emailSentSuccessfully,
    });
  } catch (error) {
    console.error("[Waitlist API Error]:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to process waitlist registration.",
      },
      { status: 500 }
    );
  }
}
